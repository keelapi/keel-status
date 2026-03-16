# Keel Status

Public status site for `status.keelapi.com`.

The site is intentionally plain: fast to load, easy to scan, and driven by static JSON artifacts that can be published from operational systems without changing application code.

## Architecture

- Stack: Next.js app router
- Rendering model: server-rendered pages reading local JSON artifacts from `public/status`
- Design goal: low ceremony, static-friendly deployment, minimal moving parts

Why Next.js:

- It is a minimal fit for a small multi-page status site with clean routing.
- It supports simple server-side file reads for local artifacts and an easy path to Vercel or static-host deployment.
- The same loader pattern can later be swapped to fetch generated artifacts from storage or a publishing pipeline.

## File tree

```text
.
|-- README.md
|-- app
|   |-- api
|   |   `-- badge
|   |       `-- route.ts
|   |-- globals.css
|   |-- incidents
|   |   `-- page.tsx
|   |-- layout.tsx
|   |-- maintenance
|   |   `-- page.tsx
|   `-- page.tsx
|-- lib
|   `-- status.ts
|-- next-env.d.ts
|-- next.config.ts
|-- package.json
|-- public
|   `-- status
|       |-- components.json
|       |-- incidents.json
|       |-- maintenance.json
|       `-- summary.json
|-- tsconfig.json
`-- types
    `-- status.ts
```

## JSON structure

Artifacts live under `public/status`.

### `summary.json`

```json
{
  "overallStatus": "Operational",
  "message": "All systems operational",
  "note": "Short human-readable summary.",
  "lastUpdated": "2026-03-16T21:30:00Z",
  "healthyComponents": 6,
  "openIncidents": 0,
  "scheduledMaintenance": 1,
  "uptime30d": "99.98% availability placeholder"
}
```

### `components.json`

```json
[
  {
    "id": "api",
    "name": "API",
    "status": "Operational",
    "description": "Public API request handling and authentication.",
    "note": "Optional compact note.",
    "updatedAt": "2026-03-16T21:30:00Z"
  }
]
```

### `incidents.json`

```json
[
  {
    "id": "inc_2026_02_18_provider_timeouts",
    "name": "Elevated provider timeout rates",
    "impact": "Degraded Performance",
    "currentStatus": "Resolved",
    "summary": "Concise incident summary.",
    "startedAt": "2026-02-18T14:07:00Z",
    "resolvedAt": "2026-02-18T14:30:00Z",
    "components": ["API", "Provider Connectivity"],
    "updates": [
      {
        "id": "update_1",
        "status": "Investigating",
        "timestamp": "2026-02-18T14:10:00Z",
        "message": "Update text."
      }
    ]
  }
]
```

### `maintenance.json`

```json
[
  {
    "id": "maint_2026_03_22_db_patch",
    "name": "Primary database patch window",
    "status": "Scheduled",
    "impact": "Brief degradation possible",
    "summary": "Planned work summary.",
    "startsAt": "2026-03-22T07:00:00Z",
    "endsAt": "2026-03-22T08:00:00Z",
    "createdAt": "2026-03-14T18:00:00Z",
    "components": ["API"],
    "updates": [
      {
        "id": "update_1",
        "status": "Scheduled",
        "timestamp": "2026-03-14T18:00:00Z",
        "message": "Update text."
      }
    ]
  }
]
```

## Supported statuses

Component status values:

- `Operational`
- `Degraded Performance`
- `Partial Outage`
- `Major Outage`
- `Maintenance`

Incident update values:

- `Investigating`
- `Identified`
- `Monitoring`
- `Resolved`

Maintenance update values:

- `Scheduled`
- `In Progress`
- `Completed`

## Local development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Updating status content

Operational content changes are data-only:

1. Update one or more JSON artifacts in `public/status`.
2. Commit the new artifacts.
3. Redeploy the site or let your host auto-deploy from git.

No application rewrite is required as long as the JSON shape remains stable.

## CI publishing from `keel-api`

Recommended flow:

1. `keel-api` CI generates fresh `summary.json`, `components.json`, `incidents.json`, and `maintenance.json`.
2. CI checks out this repo in a separate workspace.
3. CI overwrites files in `public/status/`.
4. CI commits only artifact changes.
5. CI pushes to the main branch of this repo.
6. Hosting platform deploys automatically on push.

Example high-level CI script:

```bash
git clone git@github.com:YOUR_ORG/keel-status.git
cd keel-status
cp /path/to/generated/summary.json public/status/summary.json
cp /path/to/generated/components.json public/status/components.json
cp /path/to/generated/incidents.json public/status/incidents.json
cp /path/to/generated/maintenance.json public/status/maintenance.json
git add public/status
git commit -m "Publish status artifacts"
git push origin main
```

Recommended CI guardrails:

- Validate JSON before publishing.
- Keep artifact generation deterministic.
- Always sort incidents newest first.
- Always update `summary.lastUpdated` from the same publish job.
- Avoid partial publishes; publish all four artifacts together.

## Deploy

The simplest deployment is Vercel:

1. Import this repository into Vercel.
2. Use the default Next.js build settings.
3. Point `status.keelapi.com` at the deployed project.
4. Enable automatic deploys from the default branch.

Other options:

- Deploy the Next.js server to any Node-capable host.
- If you later want fully static hosting, you can adapt the loader layer to ingest the same JSON at build time.

## Feed-ready extension path

The data model is already close to RSS/Atom or webhook publishing:

- `incidents.json` updates can be transformed into feed items.
- `maintenance.json` can back an `.ics` or feed export.
- `/api/badge` already provides a small machine-readable display surface.
