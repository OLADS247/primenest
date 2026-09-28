import { useState } from 'react';
import { api } from './api.js';
import { STATUSES } from './data.js';

export default function Ops() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.opsLogin(password);
      setToken(result.data.token);

      const next = await api.opsBoard(result.data.token);
      setBoard(next.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function save(row) {
    setError('');

    try {
      await api.updateRequest(token, row.request_id, {
        status: row.status,
        assigned_partner: row.assigned_partner,
        operations_notes: row.operations_notes
      });

      const next = await api.opsBoard(token);
      setBoard(next.data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!token) {
    return (
      <section>
        <div className="kicker">Operations</div>
        <h1>Staff only.</h1>

        <form className="form" onSubmit={login}>
          {error && <div className="error">{error}</div>}

          <label>
            Operations password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="primary" disabled={loading}>
            {loading ? 'Checking…' : 'Open board'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <div className="kicker">Operations board</div>
      <h1>Live requests</h1>

      {error && <div className="error">{error}</div>}

      {!board?.requests?.length && (
        <p className="quiet">No requests yet.</p>
      )}

      <div className="steps">
        {board?.requests?.map((row) => (
          <article className="card" key={row.request_id}>
            <strong className="ref">{row.request_id}</strong>

            <p>
              {row.customer_name} · {row.email} · {row.phone}
            </p>

            <p>
              {row.city}, {row.state} · {row.accommodation_type} ·{' '}
              {row.currency} {Number(row.budget).toLocaleString()}
            </p>

            <p className="quiet">{row.notes}</p>

            <div className="row">
              <label>
                Status
                <select
                  value={row.status}
                  onChange={(e) =>
                    setBoard({
                      ...board,
                      requests: board.requests.map((item) =>
                        item.request_id === row.request_id
                          ? { ...item, status: e.target.value }
                          : item
                      )
                    })
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label>
                Assigned partner
                <input
                  value={row.assigned_partner || ''}
                  onChange={(e) =>
                    setBoard({
                      ...board,
                      requests: board.requests.map((item) =>
                        item.request_id === row.request_id
                          ? {
                              ...item,
                              assigned_partner: e.target.value
                            }
                          : item
                      )
                    })
                  }
                />
              </label>
            </div>

            <label>
              Internal note
              <textarea
                value={row.operations_notes || ''}
                onChange={(e) =>
                  setBoard({
                    ...board,
                    requests: board.requests.map((item) =>
                      item.request_id === row.request_id
                        ? {
                            ...item,
                            operations_notes: e.target.value
                          }
                        : item
                    )
                  })
                }
              />
            </label>

            <button className="primary" onClick={() => save(row)}>
              Save
            </button>
          </article>
        ))}
      </div>

      <h2>Partner applications</h2>

      {!board?.partners?.length && (
        <p className="quiet">None yet.</p>
      )}

      {board?.partners?.map((row) => (
        <article className="card" key={row.application_id}>
          <strong>{row.application_id}</strong>
          <p>
            {row.applicant_name} · {row.partner_type} · {row.city} ·{' '}
            {row.status}
          </p>
        </article>
      ))}

      <h2>Support</h2>

      {board?.tickets?.map((row) => (
        <article className="card" key={row.ticket_id}>
          <strong>{row.ticket_id}</strong>
          <p>
            {row.name} · {row.category}
          </p>
          <p>{row.message}</p>
        </article>
      ))}
    </section>
  );
}
