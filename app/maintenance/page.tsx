import {
  formatDateTime,
  formatWindow,
  getLifecycleTone,
  getStatusData,
  getStatusTone
} from "@/lib/status";

export default async function MaintenancePage() {
  const { maintenance } = await getStatusData();

  return (
    <div className="stack-lg">
      <section className="panel page-intro">
        <p className="eyebrow">Maintenance</p>
        <h1>Scheduled maintenance windows</h1>
        <p className="summary-copy">
          Planned work is announced here before customer impact is expected.
        </p>
      </section>

      <section className="stack-md">
        {maintenance.map((item) => (
          <article key={item.id} className="panel incident-card">
            <div className="section-head">
              <div>
                <p className={`status-inline ${getStatusTone("Maintenance")}`}>Maintenance</p>
                <h2>{item.name}</h2>
              </div>
              <p className="subtle">{formatWindow(item.startsAt, item.endsAt)}</p>
            </div>
            <p>{item.summary}</p>
            <div className="maintenance-grid">
              <div>
                <dt>Status</dt>
                <dd>{item.status}</dd>
              </div>
              <div>
                <dt>Expected impact</dt>
                <dd>{item.impact}</dd>
              </div>
              <div>
                <dt>Components</dt>
                <dd>{item.components.join(", ")}</dd>
              </div>
              <div>
                <dt>Posted</dt>
                <dd>{formatDateTime(item.createdAt)}</dd>
              </div>
            </div>
            {item.updates.length > 0 ? (
              <ol className="timeline">
                {item.updates.map((update) => (
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
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
