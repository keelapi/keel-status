import { formatDateTime, getLifecycleTone, getStatusData, getStatusTone } from "@/lib/status";

export default async function IncidentsPage() {
  const { incidents } = await getStatusData();

  return (
    <div className="stack-lg">
      <section className="panel page-intro">
        <p className="eyebrow">Incident history</p>
        <h1>Resolved and active incidents</h1>
        <p className="summary-copy">
          Incidents are listed newest first with concise operational updates.
        </p>
      </section>

      <section className="stack-md">
        {incidents.map((incident) => (
          <article key={incident.id} className="panel incident-card">
            <div className="section-head">
              <div>
                <p className={`status-inline ${getStatusTone(incident.impact)}`}>
                  {incident.impact}
                </p>
                <h2>{incident.name}</h2>
              </div>
              <p className="subtle">
                {formatDateTime(incident.startedAt)}
                {incident.resolvedAt ? ` to ${formatDateTime(incident.resolvedAt)}` : " to present"}
              </p>
            </div>
            <p>{incident.summary}</p>
            <ol className="timeline">
              {incident.updates.map((update) => (
                <li key={update.id} className="timeline-item">
                  <div className="timeline-meta">
                    <span className={`status-pill ${getLifecycleTone(update.status)}`}>
                      {update.status}
                    </span>
                    <time>{formatDateTime(update.timestamp)}</time>
                  </div>
                  <p>{update.message}</p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>
    </div>
  );
}
