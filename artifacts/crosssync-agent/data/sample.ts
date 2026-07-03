export type PlatformKey = 'lovable' | 'replit';
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
export type GlobalStatusState =
  | 'in-sync'
  | 'lovable-changed'
  | 'replit-changed'
  | 'agent-running'
  | 'review-required'
  | 'sync-failed';
export type StepStatus = 'complete' | 'running' | 'pending' | 'blocked' | 'failed';
export type ChangeType =
  | 'UI Layout'
  | 'Feature'
  | 'Navigation'
  | 'Content'
  | 'Design System'
  | 'Data/API'
  | 'Bug Fix';
export type ValidationKind = 'build' | 'test' | 'lint' | 'visual';
export type ValidationStatus = 'pass' | 'fail' | 'warn' | 'running' | 'pending';
export type ActivityResult = 'Applied' | 'Review required' | 'Failed' | 'In progress';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ValidationCheck {
  kind: ValidationKind;
  status: ValidationStatus;
  detail: string;
}

export interface ActivityItem {
  id: string;
  source: PlatformKey;
  target: PlatformKey;
  summary: string;
  changeType: ChangeType;
  risk: RiskLevel;
  action: string;
  result: ActivityResult;
  timestamp: string;
  mappingRule: string;
  validation: ValidationCheck[];
}

export interface AgentStep {
  label: string;
  status: StepStatus;
  detail?: string;
}

export interface DesignCheck {
  item: string;
  status: 'pass' | 'warning' | 'fail';
  severity: 'Low' | 'Medium' | 'High';
  fix: string;
  lastChecked: string;
}

export interface FeatureItem {
  id: string;
  name: string;
  lovable: 'synced' | 'missing' | 'outdated' | 'needs-review';
  replit: 'synced' | 'missing' | 'outdated' | 'needs-review';
  lastUpdated: string;
  action: string;
}

export interface ReviewItem {
  id: string;
  summary: string;
  source: PlatformKey;
  target: PlatformKey;
  reason: string;
  suggestedAction: string;
  changeType: ChangeType;
  risk: RiskLevel;
  timestamp: string;
}

export const globalStatus: {
  state: GlobalStatusState;
  timestamp: string;
  lastEvent: string;
} = {
  state: 'agent-running',
  timestamp: '2 min ago',
  lastEvent: 'Agent detected UI layout change on Lovable — propagating to Replit',
};

export const platforms = {
  lovable: {
    name: 'Lovable Web App',
    type: 'Web · React + Vite',
    lastSaved: '5 min ago',
    detectedChange: 'New modal component added to /dashboard — 3 props changed',
    syncBadge: 'Syncing',
    syncTone: 'info' as StatusTone,
    context: [
      { label: 'Design system', value: 'Synced', ok: true },
      { label: 'Component tree', value: 'Updated', ok: true },
      { label: 'Route structure', value: '9 routes', ok: true },
      { label: 'MCP connection', value: 'Connected', ok: true },
    ],
  },
  replit: {
    name: 'Replit Mobile App',
    type: 'Expo · React Native',
    lastSaved: '3 min ago',
    detectedChange: 'Awaiting modal screen — stack route missing',
    syncBadge: 'Pending',
    syncTone: 'warning' as StatusTone,
    context: [
      { label: 'Build status', value: 'Passing', ok: true },
      { label: 'Test suite', value: '12/14 pass', ok: false },
      { label: 'Git status', value: 'Clean', ok: true },
      { label: 'MCP connection', value: 'Connected', ok: true },
    ],
  },
};

export const agentSteps: AgentStep[] = [
  { label: 'Context Sync', status: 'complete', detail: 'Both platforms loaded' },
  { label: 'Design Analysis', status: 'complete', detail: 'Token comparison done' },
  { label: 'Change Detection', status: 'running', detail: 'Scanning component diff…' },
  { label: 'Mapping Resolution', status: 'pending' },
  { label: 'Code Generation', status: 'pending' },
  { label: 'Validation', status: 'pending' },
  { label: 'Deployment', status: 'pending' },
];

export const quickStats = {
  inSync: 87,
  syncsToday: 14,
  pendingReviews: 2,
  failedSyncs: 1,
};

export const activityItems: ActivityItem[] = [
  {
    id: '1',
    source: 'lovable',
    target: 'replit',
    summary: 'Dashboard modal added',
    changeType: 'UI Layout',
    risk: 'Low',
    action: 'Created equivalent stack screen with matching props',
    result: 'Applied',
    timestamp: '2 min ago',
    mappingRule: 'Dialog → Modal Stack Screen',
    validation: [
      { kind: 'build', status: 'pass', detail: 'Build passed' },
      { kind: 'lint', status: 'pass', detail: 'No lint errors' },
      { kind: 'visual', status: 'running', detail: 'Comparing screenshots...' },
    ],
  },
  {
    id: '2',
    source: 'lovable',
    target: 'replit',
    summary: 'Primary button color updated',
    changeType: 'Design System',
    risk: 'Low',
    action: 'Updated constants/colors.ts primary token',
    result: 'Applied',
    timestamp: '18 min ago',
    mappingRule: 'CSS var → colors.ts token',
    validation: [
      { kind: 'build', status: 'pass', detail: 'Build passed' },
      { kind: 'visual', status: 'warn', detail: 'Slight hue diff on Android' },
    ],
  },
  {
    id: '3',
    source: 'replit',
    target: 'lovable',
    summary: 'Activity filter state added',
    changeType: 'Feature',
    risk: 'Medium',
    action: 'Mirrored filter bar to web Activity page',
    result: 'Review required',
    timestamp: '45 min ago',
    mappingRule: '—',
    validation: [
      { kind: 'build', status: 'pass', detail: 'Build passed' },
      { kind: 'test', status: 'fail', detail: '2 unit tests failing' },
    ],
  },
  {
    id: '4',
    source: 'lovable',
    target: 'replit',
    summary: 'Navigation sidebar restructured',
    changeType: 'Navigation',
    risk: 'High',
    action: 'Queued for human review — structural change',
    result: 'Review required',
    timestamp: '1 hr ago',
    mappingRule: 'Sidebar → Tab Bar',
    validation: [
      { kind: 'build', status: 'pass', detail: 'Build passed' },
      { kind: 'lint', status: 'warn', detail: 'Unused import detected' },
    ],
  },
  {
    id: '5',
    source: 'lovable',
    target: 'replit',
    summary: 'Search API endpoint added',
    changeType: 'Data/API',
    risk: 'Medium',
    action: 'Added /api/search route and React Query hook',
    result: 'Applied',
    timestamp: '2 hr ago',
    mappingRule: 'REST endpoint → React Query hook',
    validation: [
      { kind: 'build', status: 'pass', detail: 'Build passed' },
      { kind: 'test', status: 'pass', detail: 'All tests passing' },
    ],
  },
];

export const designChecks: DesignCheck[] = [
  { item: 'Typography scale', status: 'pass', severity: 'Low', fix: 'No action needed', lastChecked: '2 min ago' },
  { item: 'Color palette', status: 'warning', severity: 'Low', fix: 'Android hue diff on primary token', lastChecked: '5 min ago' },
  { item: 'Button hierarchy', status: 'pass', severity: 'Low', fix: 'No action needed', lastChecked: '2 min ago' },
  { item: 'Spacing & sizing', status: 'pass', severity: 'Low', fix: 'No action needed', lastChecked: '2 min ago' },
  { item: 'Navigation patterns', status: 'warning', severity: 'High', fix: 'Sidebar → Tab Bar mapping needs review', lastChecked: '1 hr ago' },
  { item: 'Form controls', status: 'pass', severity: 'Low', fix: 'No action needed', lastChecked: '2 min ago' },
  { item: 'Loading states', status: 'pass', severity: 'Low', fix: 'No action needed', lastChecked: '2 min ago' },
  { item: 'Error states', status: 'warning', severity: 'Medium', fix: 'Error boundary UI differs from web', lastChecked: '30 min ago' },
  { item: 'Empty states', status: 'pass', severity: 'Low', fix: 'No action needed', lastChecked: '2 min ago' },
  { item: 'Mobile responsiveness', status: 'pass', severity: 'Low', fix: 'No action needed', lastChecked: '2 min ago' },
];

export const featureItems: FeatureItem[] = [
  { id: '1', name: 'Dashboard overview', lovable: 'synced', replit: 'synced', lastUpdated: '2 hr ago', action: 'None' },
  { id: '2', name: 'Sync activity feed', lovable: 'synced', replit: 'synced', lastUpdated: '45 min ago', action: 'None' },
  { id: '3', name: 'Platform context panel', lovable: 'synced', replit: 'outdated', lastUpdated: '1 day ago', action: 'Update screen' },
  { id: '4', name: 'Design consistency check', lovable: 'synced', replit: 'synced', lastUpdated: '30 min ago', action: 'None' },
  { id: '5', name: 'Human review queue', lovable: 'synced', replit: 'needs-review', lastUpdated: '20 min ago', action: 'Review mapping' },
  { id: '6', name: 'Agent settings', lovable: 'synced', replit: 'synced', lastUpdated: '3 hr ago', action: 'None' },
  { id: '7', name: 'Sync planner', lovable: 'synced', replit: 'missing', lastUpdated: '—', action: 'Create screen' },
  { id: '8', name: 'Mapping rules editor', lovable: 'synced', replit: 'missing', lastUpdated: '—', action: 'Create screen' },
];

export const reviewItems: ReviewItem[] = [
  {
    id: '1',
    summary: 'Navigation sidebar restructured — requires tab bar redesign',
    source: 'lovable',
    target: 'replit',
    reason: 'High-risk structural change affecting global navigation',
    suggestedAction: 'Reorder tab bar: Dashboard · Activity · Review · Features · Settings.',
    changeType: 'Navigation',
    risk: 'High',
    timestamp: '1 hr ago',
  },
  {
    id: '2',
    summary: 'Activity filter state added to Replit — mirror to web?',
    source: 'replit',
    target: 'lovable',
    reason: 'Feature added on mobile — bidirectional sync needed',
    suggestedAction: 'Add filter bar to web Sync Activity page with same options.',
    changeType: 'Feature',
    risk: 'Medium',
    timestamp: '45 min ago',
  },
];

export const statusPillConfig: Record<
  GlobalStatusState,
  { label: string; tone: StatusTone }
> = {
  'in-sync': { label: 'In Sync', tone: 'success' },
  'lovable-changed': { label: 'Lovable Changed', tone: 'info' },
  'replit-changed': { label: 'Replit Changed', tone: 'info' },
  'agent-running': { label: 'Agent Running', tone: 'primary' },
  'review-required': { label: 'Review Required', tone: 'warning' },
  'sync-failed': { label: 'Sync Failed', tone: 'danger' },
};
