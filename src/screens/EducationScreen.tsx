'use client';

import { useState, useMemo } from 'react';
import { AppState, DegreeLevel, CredentialType, Qualification } from '@/types';
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

const FIELDS_OF_STUDY = [
  'General Medicine',
  'Surgery',
  'Pediatrics',
  'Internal Medicine',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Psychiatry',
  'Orthopedics',
  'Obstetrics & Gynecology',
  'Anesthesiology',
  'Radiology',
  'Pathology',
  'Ophthalmology',
  'Emergency Medicine',
  'Family Medicine',
  'Nursing',
  'Pharmacy',
  'Dentistry',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
  'Computer Science',
  'Information Technology',
  'Architecture',
  'Elementary Education',
  'Secondary Education',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business Administration',
  'Accounting',
  'Law',
  'Psychology',
  'Social Work',
  'Public Health',
  'Environmental Science',
];

const FIELD_OPTIONS = FIELDS_OF_STUDY.map((f) => ({ value: f, label: f }));

const ALL_COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia',
  'Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium',
  'Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei',
  'Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic',
  'Chad','Chile','China','Colombia','Comoros','Congo (DRC)','Congo (Republic)','Costa Rica',
  "Côte d'Ivoire",'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica',
  'Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia',
  'Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana',
  'Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho',
  'Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia',
  'Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
  'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru',
  'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia',
  'Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis',
  'Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','São Tomé and Príncipe',
  'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan',
  'Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste',
  'Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela',
  'Vietnam','Yemen','Zambia','Zimbabwe',
];
const COUNTRY_OPTIONS = ALL_COUNTRIES.map((c) => ({ value: c, label: c }));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: String(y), label: String(y) };
});

const EMPTY_QUALIFICATION: Qualification = {
  degreeLevel: '',
  credentialType: '',
  otherCredential: '',
  fieldOfStudy: '',
  otherFieldOfStudy: '',
  institutionName: '',
  institutionCountry: '',
  graduationYear: '',
};

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

function QualificationFields({
  prefix,
  qual,
  onChange,
  onRemove,
  showRemove,
}: {
  prefix: string;
  qual: Qualification;
  onChange: (patch: Partial<Qualification>) => void;
  onRemove?: () => void;
  showRemove: boolean;
}) {
  const [instCountrySearch, setInstCountrySearch] = useState(qual.institutionCountry);
  const [showInstDropdown, setShowInstDropdown] = useState(false);
  const [fieldSearch, setFieldSearch] = useState(
    qual.fieldOfStudy === '__other__' ? '' : qual.fieldOfStudy
  );
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!instCountrySearch.trim()) return COUNTRY_OPTIONS;
    const q = instCountrySearch.toLowerCase();
    return COUNTRY_OPTIONS.filter((c) => c.label.toLowerCase().includes(q));
  }, [instCountrySearch]);

  const filteredFields = useMemo(() => {
    const opts = [...FIELD_OPTIONS, { value: '__other__', label: 'Other (specify below)' }];
    if (!fieldSearch.trim()) return opts;
    const q = fieldSearch.toLowerCase();
    return opts.filter((f) => f.label.toLowerCase().includes(q));
  }, [fieldSearch]);

  return (
    <div className="card" style={{ padding: 32, gap: 24 }}>
      {showRemove && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="eyebrow">Additional Qualification</span>
          <button className="btn-text-link" onClick={onRemove} type="button" style={{ fontSize: 13, color: 'var(--error)' }}>
            Remove
          </button>
        </div>
      )}

      <Field label="Select your highest degree" htmlFor={`${prefix}-degree`} icon="school">
        <SelectInput
          id={`${prefix}-degree`}
          value={qual.degreeLevel}
          onChange={(v) => onChange({ degreeLevel: v as DegreeLevel })}
          options={DEGREE_LEVELS}
          placeholder="Select degree level"
        />
      </Field>

      <Field label="Type of credential" htmlFor={`${prefix}-credType`} icon="verified">
        <SelectInput
          id={`${prefix}-credType`}
          value={qual.credentialType}
          onChange={(v) => onChange({ credentialType: v as CredentialType, otherCredential: '' })}
          options={CREDENTIAL_TYPES}
          placeholder="Select credential type"
        />
      </Field>

      {qual.credentialType === 'other_credential' && (
        <Field label="Describe your credential" htmlFor={`${prefix}-otherCred`} icon="edit">
          <TextInput
            id={`${prefix}-otherCred`}
            value={qual.otherCredential}
            onChange={(v) => onChange({ otherCredential: v })}
            placeholder="e.g. Board Certification, Trade License…"
          />
        </Field>
      )}

      <Field label="Field of study or specialization" htmlFor={`${prefix}-field`} icon="biotech">
        <div className="searchable-select">
          <input
            id={`${prefix}-field`}
            type="text"
            value={qual.fieldOfStudy === '__other__' ? 'Other (specify below)' : fieldSearch}
            onChange={(e) => {
              setFieldSearch(e.target.value);
              setShowFieldDropdown(true);
              if (!e.target.value.trim()) onChange({ fieldOfStudy: '' });
            }}
            onFocus={() => setShowFieldDropdown(true)}
            onBlur={() => setTimeout(() => setShowFieldDropdown(false), 200)}
            placeholder="Search or select a field of study"
            autoComplete="off"
            style={{ paddingRight: 44 }}
          />
          <span className="material-symbols-outlined field-chev">expand_more</span>
          {showFieldDropdown && filteredFields.length > 0 && (
            <ul className="search-dropdown">
              {filteredFields.map((f) => (
                <li
                  key={f.value}
                  onMouseDown={() => {
                    if (f.value === '__other__') {
                      onChange({ fieldOfStudy: '__other__', otherFieldOfStudy: '' });
                    } else {
                      onChange({ fieldOfStudy: f.value, otherFieldOfStudy: '' });
                    }
                    setFieldSearch(f.value === '__other__' ? '' : f.label);
                    setShowFieldDropdown(false);
                  }}
                  className={qual.fieldOfStudy === f.value ? 'active' : ''}
                >
                  {f.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Field>

      {qual.fieldOfStudy === '__other__' && (
        <Field label="Specify your field of study" htmlFor={`${prefix}-otherField`} icon="edit">
          <TextInput
            id={`${prefix}-otherField`}
            value={qual.otherFieldOfStudy}
            onChange={(v) => onChange({ otherFieldOfStudy: v })}
            placeholder="e.g. Biomedical Engineering, Comparative Literature…"
          />
        </Field>
      )}

      <Field label="Institution name" htmlFor={`${prefix}-institution`} icon="account_balance">
        <TextInput
          id={`${prefix}-institution`}
          value={qual.institutionName}
          onChange={(v) => onChange({ institutionName: v })}
          placeholder="e.g. University of Damascus, Cairo University"
        />
      </Field>

      <Field label="Country where institution is located" htmlFor={`${prefix}-instCountry`} icon="public">
        <div className="searchable-select">
          <input
            id={`${prefix}-instCountry`}
            type="text"
            value={instCountrySearch}
            onChange={(e) => {
              setInstCountrySearch(e.target.value);
              setShowInstDropdown(true);
              if (!e.target.value.trim()) onChange({ institutionCountry: '' });
            }}
            onFocus={() => setShowInstDropdown(true)}
            onBlur={() => setTimeout(() => setShowInstDropdown(false), 200)}
            placeholder="Type to search countries…"
            autoComplete="off"
            style={{ paddingRight: 44 }}
          />
          <span className="material-symbols-outlined field-chev">expand_more</span>
          {showInstDropdown && filteredCountries.length > 0 && (
            <ul className="search-dropdown">
              {filteredCountries.map((c) => (
                <li
                  key={c.value}
                  onMouseDown={() => {
                    onChange({ institutionCountry: c.value });
                    setInstCountrySearch(c.label);
                    setShowInstDropdown(false);
                  }}
                  className={qual.institutionCountry === c.value ? 'active' : ''}
                >
                  {c.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Field>

      <Field label="Year of graduation or completion" htmlFor={`${prefix}-gradYear`} icon="event">
        <SelectInput
          id={`${prefix}-gradYear`}
          value={qual.graduationYear}
          onChange={(v) => onChange({ graduationYear: v })}
          options={YEARS}
          placeholder="Select year"
        />
      </Field>
    </div>
  );
}

function isQualValid(q: Qualification): boolean {
  const fieldValid =
    q.fieldOfStudy !== '' &&
    (q.fieldOfStudy !== '__other__' || q.otherFieldOfStudy.trim() !== '');
  const credValid =
    q.credentialType !== '' &&
    (q.credentialType !== 'other_credential' || q.otherCredential.trim() !== '');
  return (
    q.degreeLevel !== '' &&
    credValid &&
    fieldValid &&
    q.institutionName.trim() !== '' &&
    q.institutionCountry.trim() !== '' &&
    q.graduationYear !== ''
  );
}

export default function EducationScreen({ state, update, onBack, onContinue }: Props) {
  const primaryQual: Qualification = {
    degreeLevel: state.degreeLevel,
    credentialType: state.credentialType,
    otherCredential: state.otherCredential,
    fieldOfStudy: state.fieldOfStudy,
    otherFieldOfStudy: state.otherFieldOfStudy,
    institutionName: state.institutionName,
    institutionCountry: state.institutionCountry,
    graduationYear: state.graduationYear,
  };

  const isValid =
    isQualValid(primaryQual) &&
    state.additionalQualifications.every(isQualValid);

  const addQualification = () => {
    update({
      additionalQualifications: [...state.additionalQualifications, { ...EMPTY_QUALIFICATION }],
    });
  };

  const updateAdditional = (index: number, patch: Partial<Qualification>) => {
    const updated = state.additionalQualifications.map((q, i) =>
      i === index ? { ...q, ...patch } : q
    );
    update({ additionalQualifications: updated });
  };

  const removeAdditional = (index: number) => {
    update({
      additionalQualifications: state.additionalQualifications.filter((_, i) => i !== index),
    });
  };

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

        <QualificationFields
          prefix="primary"
          qual={primaryQual}
          onChange={(patch) => update(patch as Partial<AppState>)}
          showRemove={false}
        />

        {state.additionalQualifications.map((q, i) => (
          <QualificationFields
            key={i}
            prefix={`add-${i}`}
            qual={q}
            onChange={(patch) => updateAdditional(i, patch)}
            onRemove={() => removeAdditional(i)}
            showRemove={true}
          />
        ))}

        <button
          className="btn-outline"
          onClick={addQualification}
          type="button"
          style={{ alignSelf: 'flex-start' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Add Another Qualification
        </button>

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue} disabled={!isValid}>Continue to Documents</button>
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
