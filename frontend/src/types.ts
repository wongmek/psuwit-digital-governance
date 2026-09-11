export type Role =
  | 'DIRECTOR'
  | 'COMMITTEE'
  | 'DAI_EM'
  | 'DEPARTMENT_HEAD'
  | 'DATA_OWNER'
  | 'SYSTEM_OWNER'
  | 'SECURITY'
  | 'AUDITOR'
  | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  roles: Role[];
}

export interface GovernanceRequest {
  id: string;
  requestNo: string;
  type: string;
  title: string;
  objective: string;
  department: string;
  ownerName: string;
  dataClassification: string;
  status: string;
  riskLevel: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  description?: string;
  conditions?: string;
  timeline?: TimelineItem[];
  approvals?: Approval[];
}

export interface TimelineItem {
  id: string;
  action: string;
  note?: string;
  actorName: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  decision: string;
  comment?: string;
  approverName: string;
  createdAt: string;
}

export interface RegisterItem {
  id: string;
  category: string;
  code: string;
  name: string;
  ownerName: string;
  department: string;
  classification: string;
  status: string;
  reviewDate?: string;
  details?: Record<string, unknown>;
}

export interface Risk {
  id: string;
  code: string;
  title: string;
  category: string;
  likelihood: number;
  impact: number;
  score: number;
  level: string;
  controls: string;
  ownerName: string;
  residualScore: number;
  status: string;
  dueDate?: string;
}

export interface Incident {
  id: string;
  incidentNo: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  reporterName: string;
  occurredAt: string;
  description: string;
  responseAction?: string;
  createdAt: string;
}

export interface DashboardData {
  metrics: {
    openRequests: number;
    pendingApprovals: number;
    highRisks: number;
    openIncidents: number;
    overdueReviews: number;
    complianceRate: number;
  };
  requestsByStatus: Array<{ label: string; value: number }>;
  recentRequests: GovernanceRequest[];
  urgentItems: Array<{ id: string; type: string; title: string; level: string; dueDate?: string }>;
}
