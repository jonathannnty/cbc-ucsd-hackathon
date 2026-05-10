import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { AppState, Pathway } from '@/types';
import { PATHWAYS, EVALUATORS } from '@/data';

export const runtime = 'nodejs';

const AGENT_ID = 'agent_01Lpts97PNMX1ZjUti9cRwBY';
const ENVIRONMENT_ID = 'env_019KPuJYXNaoyL3Eorbf7y2g';

const PROFESSION_LABELS: Record<string, string> = {
  doctor:    'Doctor / Physician',
  nurse:     'Registered Nurse',
  engineer:  'Civil / Mechanical Engineer',
  teacher:   'Primary / Secondary Teacher',
  architect: 'Architect',
};

const DEGREE_LABELS: Record<string, string> = {
  high_school:  'High School Diploma',
  associate:    'Associate Degree',
  bachelor:     "Bachelor's Degree",
  master:       "Master's Degree",
  doctoral:     'Doctoral Degree',
  professional: 'Professional Degree',
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

  const pathway: Pathway | undefined = state.pickedPathway !== null ? PATHWAYS[state.pickedPathway] : undefined;
  const evaluator =
    state.pickedEvaluator !== null ? EVALUATORS[state.pickedEvaluator] : null;

  return `You are a credential-translation advisor for CertConvert, helping immigrants and refugees recertify in the United States.

USER PROFILE
- Profession: ${profession}
- Country of origin: ${state.country}
- Target US state: ${state.usState}
- Degree: ${DEGREE_LABELS[state.degreeLevel] ?? state.degreeLevel}${state.fieldOfStudy ? ` in ${state.fieldOfStudy}` : ''}
- Institution: ${state.institutionName || 'Not specified'}${state.institutionCountry ? ` (${state.institutionCountry})` : ''}
- Graduation year: ${state.graduationYear || 'Not specified'}
- Credential type: ${state.credentialType}
- Document situation: ${DOC_LABELS[state.docSituation] ?? state.docSituation}
- Budget: $${state.budget.toLocaleString()}
- Time available: ${state.months} months
- Chosen pathway: ${pathway ? `${pathway.title} (${pathway.time}, ${pathway.cost})` : 'Not specified'}
- NACES evaluator: ${evaluator ? evaluator.name : 'Will arrange later'}

Return ONLY a valid JSON object matching this schema. No surrounding text, no markdown code fences.

{
  "summary": "1-2 warm sentences acknowledging this professional's background and validating their pathway choice.",
  "tasks": [
    {
      "title": "Specific next action",
      "desc": "Detailed instruction including who to contact or what to submit",
      "status": "priority",
      "statusLabel": "High Priority"
    }
  ],
  "progressPct": 10,
  "progress": [
    { "label": "Documents Submitted", "value": "0 / 5" }
  ],
  "resources": [
    {
      "icon": "school",
      "name": "Organization or agency name",
      "contact": "phone number, URL, or email",
      "desc": "One sentence describing what this resource provides"
    }
  ],
  "roadblocks": [
    {
      "challenge": "The specific obstacle this person will face",
      "solution": "A concrete step to address or avoid it"
    }
  ],
  "budget": [
    {
      "phase": "Phase name",
      "cost": "$X – $Y",
      "desc": "What costs this phase covers"
    }
  ]
}

REQUIREMENTS:
- tasks: 4-6 items ordered by urgency; status must be exactly one of "priority", "upcoming", or "completed"; statusLabel must be exactly "High Priority", "Upcoming", or "Completed"
- progressPct: integer 0–100; derive from docSituation (destroyed/none → 5, partial → 15, all → 30) and pathway progress
- progress: exactly 3 rows using "X / Y" format, relevant to this profession and pathway
- resources: 3–5 items specific to ${state.usState} and the user's profession; icon must be a valid Material Symbols name (e.g. "school", "phone", "computer", "medical_services", "email", "gavel", "language")
- roadblocks: 2–3 items; be honest and specific to their situation
- budget: 3–5 phases with realistic USD cost ranges for the chosen pathway`;
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
          agent: AGENT_ID,
          environment_id: ENVIRONMENT_ID,
        });

        // Stream-first: open SSE before sending so no early events are missed
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
