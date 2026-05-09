'use client';

import { AppState, Profession } from '@/types';
import { Field, SelectInput, TextInput } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

const PROFESSIONS = [
  { value: 'doctor',    label: 'Doctor / Physician' },
  { value: 'nurse',     label: 'Registered Nurse' },
  { value: 'engineer',  label: 'Civil / Mechanical Engineer' },
  { value: 'teacher',   label: 'Primary / Secondary Teacher' },
  { value: 'architect', label: 'Architect' },
  { value: 'other',     label: 'Other Professional' },
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function IdentityScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <span className="eyebrow">Step 1 of 8</span>
          <h1 className="display">Tell Us About You</h1>
          <p className="lead">
            We use this information to customize your professional credentialing pathway.
            All data is handled securely.
          </p>
        </div>

        <div className="card" style={{ padding: 32, gap: 24 }}>
          <Field label="What was your profession in your home country?" htmlFor="prof" icon="work">
            <SelectInput
              id="prof"
              value={state.profession}
              onChange={(v) => update({ profession: v as Profession, otherProfession: '' })}
              options={PROFESSIONS}
              placeholder="Search or select a profession"
            />
          </Field>

          {state.profession === 'other' && (
            <Field label="Please describe your profession" htmlFor="otherProf" icon="edit">
              <TextInput
                id="otherProf"
                value={state.otherProfession}
                onChange={(v) => update({ otherProfession: v })}
                placeholder="e.g. Dentist, Veterinarian, Pharmacist…"
              />
            </Field>
          )}

          <Field label="Which country did you earn your degree in?" htmlFor="country" icon="public">
            <TextInput
              id="country"
              value={state.country}
              onChange={(v) => update({ country: v })}
              placeholder="Enter country name"
            />
          </Field>

          <Field label="Which US state do you live in now?" htmlFor="usState" icon="location_on">
            <SelectInput
              id="usState"
              value={state.usState}
              onChange={(v) => update({ usState: v })}
              options={US_STATES}
              placeholder="Select a state"
            />
          </Field>

          <div className="row-actions">
            <button className="btn-secondary" onClick={onBack}>Back</button>
            <button className="btn-primary" onClick={onContinue}>Continue to Education</button>
          </div>
        </div>
      </div>

      <WhyDoWeNeedThis>
        Credentialing requirements vary significantly by state and professional background.
        Providing accurate details ensures your pathway includes the specific boards and agencies
        you&rsquo;ll need to contact.
      </WhyDoWeNeedThis>
    </div>
  );
}
