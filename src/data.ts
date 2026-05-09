import { Pathway, Evaluator, Task, AppState } from './types';

// Recommended card is first — it renders first in the pathway grid.
export const PATHWAYS: Pathway[] = [
  {
    icon: 'group_add',
    title: 'PA (Bridge Track)',
    time: '24 Months',
    cost: '$2,000+',
    confidence: 'High',
    desc: 'A specialized track for IMGs that leverages prior medical training.',
    recommended: true,
  },
  {
    icon: 'medical_services',
    title: 'Medical Scribe',
    time: '3-6 Months',
    cost: '$300 - $800',
    confidence: 'High',
    desc: 'Gain US clinical environment exposure and work alongside clinicians.',
  },
  {
    icon: 'science',
    title: 'Clinical Research Asst.',
    time: '6-9 Months',
    cost: '$500 - $1,200',
    confidence: 'High',
    desc: 'Apply analytical skills to manage data and patient protocols.',
  },
  {
    icon: 'medication',
    title: 'Pharmacy Technician',
    time: '4-12 Months',
    cost: '$200 - $1,500',
    confidence: 'Medium',
    desc: 'Apply your pharmacology knowledge in retail or hospital settings.',
  },
];

export const EVALUATORS: Evaluator[] = [
  {
    name: 'Josef Silny',
    subtitle: 'NACES Member',
    metric: '$90 USD',
    metricLabel: 'Starting from',
    ribbon: { icon: 'payments', label: 'Cheapest' },
    bullets: [
      'Best value for general evaluations',
      '10-15 business day turnaround',
      'Translation services available',
    ],
  },
  {
    name: 'WES',
    subtitle: 'World Education Services',
    metric: '7 Days',
    metricLabel: 'Turnaround',
    ribbon: { icon: 'speed', label: 'Fastest' },
    bullets: [
      'Digital badge integration included',
      'Recognized by 2,500+ institutions',
      'Robust online document portal',
    ],
  },
  {
    name: 'ECFMG',
    subtitle: 'Medical Professionals',
    metric: 'Clinical',
    metricLabel: 'Focus',
    ribbon: { icon: 'medical_services', label: 'Best for Medical' },
    bullets: [
      'Required for USMLE pathways',
      'Specialized residency reporting',
      'Verification at source (EPIC)',
    ],
  },
];

export const PLAN_TASKS: Task[] = [
  {
    id: 1,
    title: 'Submit WES Evaluation',
    desc: 'Request official transcripts from your degree-granting institution.',
    status: 'priority',
    statusLabel: 'High Priority',
  },
  {
    id: 2,
    title: 'Register for Step 1',
    desc: 'USMLE application submitted — confirm receipt.',
    status: 'completed',
    statusLabel: 'Completed',
  },
  {
    id: 3,
    title: 'Background Check Authorization',
    desc: 'Provide digital signature for state-level clearance.',
    status: 'upcoming',
    statusLabel: 'Upcoming',
  },
  {
    id: 4,
    title: 'Schedule TOEFL Exam',
    desc: 'Book your earliest available test center slot.',
    status: 'upcoming',
    statusLabel: 'Upcoming',
  },
];

export const INITIAL_STATE: AppState = {
  screen: 'welcome',
  profession: 'doctor',
  otherProfession: '',
  country: 'Syria',
  usState: 'NY',
  degreeLevel: 'bachelor',
  credentialType: 'degree',
  fieldOfStudy: '',
  institutionName: '',
  institutionCountry: '',
  graduationYear: '',
  docSituation: 'partial',
  budget: 2000,
  months: 24,
  pickedPathway: 0,
  pickedEvaluator: 1,
};
