export type ComponentStatus =
  | "Operational"
  | "Degraded Performance"
  | "Partial Outage"
  | "Major Outage"
  | "Maintenance";

export type IncidentLifecycleStatus =
  | "Investigating"
  | "Identified"
  | "Monitoring"
  | "Resolved";

export type MaintenanceLifecycleStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed";

export type StatusSummary = {
  overallStatus: ComponentStatus;
  message: string;
  note: string;
  lastUpdated: string;
  healthyComponents: number;
  openIncidents: number;
  scheduledMaintenance: number;
  uptime30d: string;
};

export type StatusComponent = {
  id: string;
  name: string;
  status: ComponentStatus;
  description: string;
  note?: string;
  updatedAt: string;
};

export type IncidentUpdate = {
  id: string;
  status: IncidentLifecycleStatus;
  timestamp: string;
  message: string;
};

export type StatusIncident = {
  id: string;
  name: string;
  impact: Exclude<ComponentStatus, "Maintenance">;
  currentStatus: IncidentLifecycleStatus;
  summary: string;
  startedAt: string;
  resolvedAt?: string;
  components: string[];
  updates: IncidentUpdate[];
};

export type MaintenanceUpdate = {
  id: string;
  status: MaintenanceLifecycleStatus;
  timestamp: string;
  message: string;
};

export type MaintenanceItem = {
  id: string;
  name: string;
  status: MaintenanceLifecycleStatus;
  impact: "No expected impact" | "Brief degradation possible" | "Short interruption expected";
  summary: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  components: string[];
  updates: MaintenanceUpdate[];
};
