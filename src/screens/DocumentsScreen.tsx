'use client';

import { AppState, DocSituation } from '@/types';
import { RadioCard } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

const DOC_OPTIONS: { id: DocSituation; icon: string; title: string; desc: string }[] = [
  {
    id: 'all',
    icon: 'folder_zip',
    title: 'I have all my documents',
    desc: 'Diplomas, transcripts, and licenses are with me.',
  },
  {
    id: 'partial',
    icon: 'description',
    title: 'I have some documents',
    desc: 'I have a few — others are missing or back home.',
  },
  {
    id: 'none',
    icon: 'help_outline',
    title: 'I have nothing on paper',
    desc: 'I had to leave without any official records.',
  },
  {
    id: 'destroyed',
    icon: 'event_busy',
    title: 'My institution no longer exists',
    desc: 'My university or licensing body has closed.',
  },
];

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function DocumentsScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack">
        <div>
          <span className="eyebrow">Step 3 of 8</span>
          <h1 className="display">Your Documents Situation</h1>
          <p className="lead">
            Many people arrive without their original credentials. Tell us where you stand —
            there&rsquo;s a path either way.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DOC_OPTIONS.map((o) => (
            <RadioCard
              key={o.id}
              icon={o.icon}
              title={o.title}
              desc={o.desc}
              selected={state.docSituation === o.id}
              onSelect={() => update({ docSituation: o.id })}
            />
          ))}
        </div>

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Continue to Budget</button>
        </div>
      </div>

      <WhyDoWeNeedThis>
        If your documents are unavailable, we&rsquo;ll route you toward bridging programs and
        refugee-credentialing attorneys who can help reconstruct your record.
      </WhyDoWeNeedThis>
    </div>
  );
}
