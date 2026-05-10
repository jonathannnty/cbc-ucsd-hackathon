import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { AppState } from '@/types';

export const runtime = 'nodejs';

const PATHWAY_AGENT_ID = 'agent_01Unya7PQEGAa52Vk77HLYFa';
const ENVIRONMENT_ID = 'env_019KPuJYXNaoyL3Eorbf7y2g';

const PROFESSION_LABELS: Record<string, string> = {
  doctor:    'Doctor / Physician',
  nurse:     'Registered Nurse',
  engineer:  'Civil / Mechanical Engineer',
  teacher:   'Primary / Secondary Teacher',
  architect: 'Architect',
};

const DOC_LABELS: Record<string, string> = {
  all:     'Has all original documents',
  partial: 'Has some documents — others are missing or need re-issuance',
  none:    'No documents currently available',
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
- Institution: ${state.institutionName || 'Not specified'}${state.institutionCountry ? ` (${state.institutionCountry})` : ''}
- Graduation year: ${state.graduationYear || 'Not specified'}
- Credential type: ${state.credentialType}
- Document situation: ${DOC_LABELS[state.docSituation] ?? state.docSituation}
- Budget: $${state.budget.toLocaleString()}
- Time available: ${state.months} months`;
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
          agent: PATHWAY_AGENT_ID,
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
