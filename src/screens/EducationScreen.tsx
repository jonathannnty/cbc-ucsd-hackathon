'use client';

import { AppState, DegreeLevel, CredentialType } from '@/types';
import { Field, SelectInput, TextInput } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

const DEGREE_LEVELS = [
  { value: 'high_school',  label: 'High School / Secondary' },
  { value: 'associate',    label: 'Associate Degree (2 years)' },
  { value: 'bachelor',     label: "Bachelor's Degree (4 years)" },
  { value: 'master',       label: "Master's Degree" },
  { value: 'doctoral',     label: 'Doctoral Degree (PhD, EdD)' },
  { value: 'professional', label: 'Professional Degree (MD, JD, DDS…)' },
];

const CREDENTIAL_TYPES = [
  { value: 'degree',           label: 'Academic Degree' },
  { value: 'license',          label: 'Professional License' },
  { value: 'certification',    label: 'Professional Certification' },
  { value: 'diploma',          label: 'Diploma / Vocational Certificate' },
  { value: 'other_credential', label: 'Other Credential' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: String(y), label: String(y) };
});

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function EducationScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <span className="eyebrow">Step 2 of 8</span>
          <h1 className="display">Your Education</h1>
          <p className="lead">
            Tell us about the highest qualification you earned in your home country. This helps us
            find the closest US equivalents and identify the right evaluator.
          </p>
        </div>

        <div className="card" style={{ padding: 32, gap: 24 }}>
          <Field label="Highest degree or qualification level" htmlFor="degree" icon="school">
            <SelectInput
              id="degree"
              value={state.degreeLevel}
              onChange={(v) => update({ degreeLevel: v as DegreeLevel })}
              options={DEGREE_LEVELS}
              placeholder="Select degree level"
            />
          </Field>

          <Field label="Type of credential" htmlFor="credType" icon="verified">
            <SelectInput
              id="credType"
              value={state.credentialType}
              onChange={(v) => update({ credentialType: v as CredentialType })}
              options={CREDENTIAL_TYPES}
              placeholder="Select credential type"
            />
          </Field>

          <Field label="Field of study or specialization" htmlFor="field" icon="biotech">
            <TextInput
              id="field"
              value={state.fieldOfStudy}
              onChange={(v) => update({ fieldOfStudy: v })}
              placeholder="e.g. General Medicine, Civil Engineering, Elementary Education"
            />
          </Field>

          <Field label="Institution name" htmlFor="institution" icon="account_balance">
            <TextInput
              id="institution"
              value={state.institutionName}
              onChange={(v) => update({ institutionName: v })}
              placeholder="e.g. University of Damascus, Cairo University"
            />
          </Field>

          <Field
            label="Country where institution is located"
            htmlFor="instCountry"
            icon="public"
          >
            <TextInput
              id="instCountry"
              value={state.institutionCountry}
              onChange={(v) => update({ institutionCountry: v })}
              placeholder="Enter country name"
            />
          </Field>

          <Field label="Year of graduation or completion" htmlFor="gradYear" icon="event">
            <SelectInput
              id="gradYear"
              value={state.graduationYear}
              onChange={(v) => update({ graduationYear: v })}
              options={YEARS}
              placeholder="Select year"
            />
          </Field>

          <div className="row-actions">
            <button className="btn-secondary" onClick={onBack}>Back</button>
            <button className="btn-primary" onClick={onContinue}>Continue to Documents</button>
          </div>
        </div>
      </div>

      <WhyDoWeNeedThis>
        US credential evaluators and licensing boards use your degree level, field, and institution
        to determine equivalency. Accurate information here avoids delays or rejections at the
        evaluation stage.
      </WhyDoWeNeedThis>
    </div>
  );
}
