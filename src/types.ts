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
  | ''
  | 'doctor'
  | 'nurse'
  | 'engineer'
  | 'teacher'
  | 'architect'
  | 'other';

export type DegreeLevel =
  | ''
  | 'high_school'
  | 'associate'
  | 'bachelor'
  | 'master'
  | 'doctoral'
  | 'professional';

export type CredentialType =
  | ''
  | 'degree'
  | 'license'
  | 'certification'
  | 'diploma'
  | 'other_credential';

export type DocSituation = '' | 'all' | 'partial' | 'none';

export interface Qualification {
  degreeLevel: DegreeLevel;
  credentialType: CredentialType;
  otherCredential: string;
  fieldOfStudy: string;
  otherFieldOfStudy: string;
  institutionName: string;
  institutionCountry: string;
  graduationYear: string;
}

export interface AppState {
  screen: Screen;
  // identity
  profession: Profession;
  otherProfession: string;
  country: string;
  usState: string;
  // education (primary)
  degreeLevel: DegreeLevel;
  credentialType: CredentialType;
  otherCredential: string;
  fieldOfStudy: string;
  otherFieldOfStudy: string;
  institutionName: string;
  institutionCountry: string;
  graduationYear: string;
  additionalQualifications: Qualification[];
  // documents
  docSituation: DocSituation;
  // budget
  budget: number;
  months: number;
  // pathway + verification
  pickedPathway: number | null;
  pickedEvaluator: number | null;
  // caching (to prevent refetches on screen navigation)
  cachedPathways: Pathway[] | null;
  cachedEvaluators: Evaluator[] | null;
  cachedPlan: AgentPlan | null;
}

export interface Pathway {
  icon: string;
  title: string;
  time: string;
  cost: string;
  confidence: number;
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
  url?: string;
}

export interface Task {
  id: number;
  title: string;
  desc: string;
  link?: { url: string; label: string };
  status: 'priority' | 'completed' | 'upcoming';
  statusLabel: string;
}

export interface AgentTask {
  title: string;
  desc: string;
  status: 'priority' | 'upcoming' | 'completed';
  statusLabel: string;
}

export interface AgentPlan {
  summary: string;
  tasks: AgentTask[];
  progressPct: number;
  progress: { label: string; value: string }[];
  resources: { icon: string; name: string; contact: string; desc: string }[];
  roadblocks: { challenge: string; solution: string }[];
  budget: { phase: string; cost: string; desc: string }[];
}
