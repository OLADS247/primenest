import { useState } from 'react';
import { api } from './api.js';
import { SUPPORT_CATEGORIES } from './data.js';

export default function Support() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    request_id: '',
    category: 'General Question',
    message: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  function set(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.createTicket(form);
      setDone(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <section className="panel">
        <div className="kicker">Ticket</div>
        <h1>{done.ticket_id}</h1>
        <p>Status: {done.status}</p>
      </section>
    );
  }

  return (
    <section>
      <div className="kicker">Support</div>

      <h1>Contact PrimeNest.</h1>

      <form className="form" onSubmit={submit}>
        {error && <div className="error">{error}</div>}

        <div className="row">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </label>

          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </label>

          <label>
            Request ID
            <input
              value={form.request_id}
              onChange={(e) => set('request_id', e.target.value)}
            />
          </label>

          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {SUPPORT_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Message
          <textarea
            required
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
          />
        </label>

        <button className="primary" disabled={loading}>
          {loading ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </section>
  );
}
