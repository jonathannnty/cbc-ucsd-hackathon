export type Screen =
  | 'welcome'
  | 'identity'
  | 'education'
  | 'documents'
  | 'budget'
  | 'pathway'
  | 'verification'
  | 'plan'
  | 'complete';

export type Profession =
  | 'doctor'
  | 'nurse'
  | 'engineer'
  | 'teacher'
  | 'architect'
  | 'other';

export type DegreeLevel =
  | 'high_school'
  | 'associate'
  | 'bachelor'
  | 'master'
  | 'doctoral'
  | 'professional';

export type CredentialType =
  | 'degree'
  | 'license'
  | 'certification'
  | 'diploma'
  | 'other_credential';

export type DocSituation = 'all' | 'partial' | 'none' | 'destroyed';

export interface AppState {
  screen: Screen;
  // identity
  profession: Profession;
  otherProfession: string;
  country: string;
  usState: string;
  // education
  degreeLevel: DegreeLevel;
  credentialType: CredentialType;
  fieldOfStudy: string;
  institutionName: string;
  institutionCountry: string;
  graduationYear: string;
  // documents
  docSituation: DocSituation;
  // budget
  budget: number;
  months: number;
  // pathway + verification
  pickedPathway: number;
  pickedEvaluator: number | null;
}

export interface Pathway {
  icon: string;
  title: string;
  time: string;
  cost: string;
  confidence: 'High' | 'Medium' | 'Low';
  desc: string;
  recommended?: boolean;
}

export interface Evaluator {
  name: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  ribbon: { icon: string; label: string };
  bullets: string[];
}

export interface Task {
  id: number;
  title: string;
  desc: string;
  status: 'priority' | 'completed' | 'upcoming';
  statusLabel: string;
}
