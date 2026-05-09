import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { AppState } from '@/types';

export const runtime = 'nodejs';

// Run `ant beta:agents create` with agents/evaluator-recommender.yaml and paste the returned ID here.
const EVALUATOR_AGENT_ID = 'agent_01TvLDcF5nn7Dyey2AsPW31V';
const ENVIRONMENT_ID = 'env_019KPuJYXNaoyL3Eorbf7y2g';

const PROFESSION_LABELS: Record<string, string> = {
  doctor:    'Doctor / Physician',
  nurse:     'Registered Nurse',
  engineer:  'Civil / Mechanical Engineer',
  teacher:   'Primary / Secondary Teacher',
  architect: 'Architect',
};

function buildPrompt(state: AppState): string {
  const profession =
    state.profession === 'other' && state.otherProfession
      ? state.otherProfession
      : (PROFESSION_LABELS[state.profession] ?? state.profession);

  return `USER PROFILE
- Profession: ${profession}
- Country of origin: ${state.country}
- Target US state: ${state.usState}
- Degree: ${state.degreeLevel}${state.fieldOfStudy ? ` in ${state.fieldOfStudy}` : ''}
- Institution: ${state.institutionName || 'Not specified'}
- Graduation year: ${state.graduationYear || 'Not specified'}
- Credential type: ${state.credentialType}
- Budget: $${state.budget.toLocaleString()}`;
}

export async function POST(req: NextRequest) {
  const state: AppState = await req.json();

  const client = new Anthropic({
    defaultHeaders: { 'anthropic-beta': 'managed-agents-2026-04-01' },
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const session = await client.beta.sessions.create({
          agent: EVALUATOR_AGENT_ID,
          environment_id: ENVIRONMENT_ID,
        });

        const eventStream = await client.beta.sessions.events.stream(session.id);

        client.beta.sessions.events.send(session.id, {
          events: [{
            type: 'user.message',
            content: [{ type: 'text', text: buildPrompt(state) }],
          }],
        }).catch(console.error);

        for await (const event of eventStream) {
          if (event.type === 'agent.message') {
            for (const block of event.content) {
              if (block.type === 'text' && block.text) {
                controller.enqueue(encoder.encode(block.text));
              }
            }
          } else if (
            event.type === 'session.status_idle' ||
            event.type === 'session.status_terminated'
          ) {
            break;
          }
        }

        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`__AGENT_ERROR__${msg}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
