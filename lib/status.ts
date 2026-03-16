import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  ComponentStatus,
  IncidentLifecycleStatus,
  MaintenanceItem,
  MaintenanceLifecycleStatus,
  StatusComponent,
  StatusIncident,
  StatusSummary
} from "@/types/status";

const STATUS_DIR = path.join(process.cwd(), "public", "status");

async function readStatusFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(STATUS_DIR, fileName);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

export async function getSummary() {
  return readStatusFile<StatusSummary>("summary.json");
}

export async function getComponents() {
  return readStatusFile<StatusComponent[]>("components.json");
}

export async function getIncidents() {
  return readStatusFile<StatusIncident[]>("incidents.json");
}

export async function getMaintenance() {
  return readStatusFile<MaintenanceItem[]>("maintenance.json");
}

export async function getStatusData() {
  const [summary, components, incidents, maintenance] = await Promise.all([
    getSummary(),
    getComponents(),
    getIncidents(),
    getMaintenance()
  ]);

  return { summary, components, incidents, maintenance };
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function formatWindow(start: string, end: string) {
  return `${formatDateTime(start)} to ${formatDateTime(end)} UTC`;
}

export function getStatusTone(status: ComponentStatus) {
  switch (status) {
    case "Operational":
      return "tone-operational";
    case "Degraded Performance":
      return "tone-degraded";
    case "Partial Outage":
      return "tone-partial";
    case "Major Outage":
      return "tone-major";
    case "Maintenance":
      return "tone-maintenance";
    default:
      return "tone-operational";
  }
}

export function getLifecycleTone(
  status: IncidentLifecycleStatus | MaintenanceLifecycleStatus
) {
  switch (status) {
    case "Resolved":
    case "Completed":
      return "tone-operational";
    case "Monitoring":
    case "Scheduled":
      return "tone-maintenance";
    case "Investigating":
      return "tone-major";
    case "Identified":
    case "In Progress":
      return "tone-degraded";
    default:
      return "tone-maintenance";
  }
}

export function getLatestOpenIncident(incidents: StatusIncident[]) {
  return incidents.find((incident) => incident.currentStatus !== "Resolved") ?? null;
}

export function getLatestActiveMaintenance(maintenance: MaintenanceItem[]) {
  const now = Date.now();
  return (
    maintenance.find((item) => new Date(item.endsAt).getTime() >= now) ?? null
  );
}
