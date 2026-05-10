// Valid Material Symbols Outlined icon names from pathway and evaluator agents
export const VALID_ICONS = new Set([
  // Medical / Healthcare
  'medical_services', 'stethoscope', 'biotech', 'science', 'vaccines', 'health_and_safety',
  // Bridge / Collaborative
  'group_add', 'people', 'diversity_3', 'handshake',
  // Education / Exams
  'school', 'menu_book', 'edit_note', 'quiz',
  // Engineering / Technical
  'engineering', 'precision_manufacturing', 'construction', 'architecture',
  // Administrative / Professional
  'work', 'business_center', 'manage_accounts', 'badge',
  // Pharmacy / Allied Health
  'medication', 'local_pharmacy', 'favorite',
  // Research
  'lab_research', 'data_exploration', 'analytics',
  // Fast-track / Growth
  'trending_up', 'rocket_launch', 'bolt',
  // Legal / Regulatory
  'gavel', 'policy', 'verified',
  // Evaluator-specific
  'payments', 'speed', 'verified_user', 'check_circle', 'info',
]);

export function isValidIcon(icon: string | undefined): boolean {
  return icon ? VALID_ICONS.has(icon) : false;
}

export function getValidIcon(icon: string | undefined): string {
  return isValidIcon(icon) ? icon! : 'help';
}
