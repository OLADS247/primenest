import { useState } from 'react';
import { api } from './api.js';

export default function Track() {
  const [request_id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState(null);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setRow(null);
    setLoading(true);

    try {
      const result = await api.trackRequest({
        request_id,
        email
      });

      setRow(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="kicker">Track</div>

      <h1>Check a request.</h1>

      <form className="form" onSubmit={submit}>
        {error && <div className="error">{error}</div>}

        <label>
          Request ID
          <input
            required
            value={request_id}
            onChange={(e) => setId(e.target.value)}
            placeholder="PN-LAG-2026-000001"
          />
        </label>

        <label>
          Email used on the form
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button className="primary" disabled={loading}>
          {loading ? 'Checking…' : 'Track request'}
        </button>
      </form>

      {row && (
        <article className="panel" style={{ marginTop: 16 }}>
          <p className="ref">{row.request_id}</p>

          <p>
            <span className="badge">{row.status}</span>
          </p>

          <p>
            {row.customer_name} · {row.city}, {row.state}
          </p>

          <p>
            {row.accommodation_type} · {row.currency}{' '}
            {Number(row.budget).toLocaleString()}
          </p>

          <p className="quiet">{row.next_step}</p>

          {row.assigned_partner && (
            <p>Assigned partner: {row.assigned_partner}</p>
          )}
        </article>
      )}
    </section>
  );
}
