'use client';

import { useState, useMemo } from 'react';
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
  const [countrySearch, setCountrySearch] = useState(state.country);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_OPTIONS;
    const q = countrySearch.toLowerCase();
    return COUNTRY_OPTIONS.filter((c) => c.label.toLowerCase().includes(q));
  }, [countrySearch]);

  const isValid =
    state.profession !== '' &&
    (state.profession !== 'other' || state.otherProfession.trim() !== '') &&
    state.country.trim() !== '' &&
    state.usState !== '';

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
            <div className="searchable-select">
              <input
                id="country"
                type="text"
                value={countrySearch}
                onChange={(e) => {
                  setCountrySearch(e.target.value);
                  setShowCountryDropdown(true);
                  if (!e.target.value.trim()) update({ country: '' });
                }}
                onFocus={() => setShowCountryDropdown(true)}
                onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                placeholder="Type to search countries…"
                autoComplete="off"
                style={{ paddingRight: 44 }}
              />
              <span className="material-symbols-outlined field-chev">expand_more</span>
              {showCountryDropdown && filteredCountries.length > 0 && (
                <ul className="search-dropdown">
                  {filteredCountries.map((c) => (
                    <li
                      key={c.value}
                      onMouseDown={() => {
                        update({ country: c.value });
                        setCountrySearch(c.label);
                        setShowCountryDropdown(false);
                      }}
                      className={state.country === c.value ? 'active' : ''}
                    >
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
            <button className="btn-primary" onClick={onContinue} disabled={!isValid}>Continue to Education</button>
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
