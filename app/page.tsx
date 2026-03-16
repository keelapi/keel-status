import Link from "next/link";
import {
  formatDateTime,
  formatWindow,
  getLatestActiveMaintenance,
  getLatestOpenIncident,
  getStatusData,
  getStatusTone
} from "@/lib/status";

export default async function HomePage() {
  const { summary, components, incidents, maintenance } = await getStatusData();
  const activeIncident = getLatestOpenIncident(incidents);
  const activeMaintenance = getLatestActiveMaintenance(maintenance);

  return (
    <div className="stack-lg">
      <section className="panel hero">
        <div className="hero-head">
          <div>
            <p className="eyebrow">Current status</p>
            <h1>{summary.message}</h1>
          </div>
          <span className={`status-pill ${getStatusTone(summary.overallStatus)}`}>
            {summary.overallStatus}
          </span>
        </div>
        <p className="summary-copy">{summary.note}</p>
        <dl className="summary-grid">
          <div>
            <dt>Last updated</dt>
            <dd>{formatDateTime(summary.lastUpdated)}</dd>
          </div>
          <div>
            <dt>Components</dt>
            <dd>{summary.healthyComponents} healthy</dd>
          </div>
          <div>
            <dt>Open incidents</dt>
            <dd>{summary.openIncidents}</dd>
          </div>
          <div>
            <dt>Scheduled maintenance</dt>
            <dd>{summary.scheduledMaintenance}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <h2>Component status</h2>
            <p className="subtle">Each core surface is reported independently.</p>
          </div>
        </div>
        <div className="component-list">
          {components.map((component) => (
            <article key={component.id} className="component-row">
              <div>
                <h3>{component.name}</h3>
                <p className="subtle">{component.description}</p>
              </div>
              <div className="component-meta">
                <span className={`status-pill ${getStatusTone(component.status)}`}>
                  {component.status}
                </span>
                <p className="timestamp">{formatDateTime(component.updatedAt)}</p>
              </div>
              {component.note ? <p className="component-note">{component.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="split">
        <article className="panel">
          <div className="section-head">
            <h2>Incident summary</h2>
            <Link href="/incidents">View all incidents</Link>
          </div>
          {activeIncident ? (
            <div className="event-card">
              <p className={`status-inline ${getStatusTone(activeIncident.impact)}`}>
                {activeIncident.impact}
              </p>
              <h3>{activeIncident.name}</h3>
              <p>{activeIncident.currentStatus}</p>
              <p className="subtle">
                Started {formatDateTime(activeIncident.startedAt)}
              </p>
            </div>
          ) : (
            <p className="empty-state">No active incidents.</p>
          )}
        </article>

        <article className="panel">
          <div className="section-head">
            <h2>Maintenance</h2>
            <Link href="/maintenance">View schedule</Link>
          </div>
          {activeMaintenance ? (
            <div className="event-card">
              <p className={`status-inline ${getStatusTone("Maintenance")}`}>Maintenance</p>
              <h3>{activeMaintenance.name}</h3>
              <p>{activeMaintenance.status}</p>
              <p className="subtle">{formatWindow(activeMaintenance.startsAt, activeMaintenance.endsAt)}</p>
            </div>
          ) : (
            <p className="empty-state">No active or upcoming maintenance.</p>
          )}
        </article>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <h2>Status badge</h2>
            <p className="subtle">Embeddable summary for docs and external surfaces.</p>
          </div>
        </div>
        <div className="badge-preview">
          <img alt="Keel status badge" src="/api/badge" />
          <code>https://status.keelapi.com/api/badge</code>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <h2>30 day uptime</h2>
            <p className="subtle">Placeholder for a future generated availability rollup.</p>
          </div>
        </div>
        <p className="uptime-placeholder">{summary.uptime30d}</p>
      </section>
    </div>
  );
}
