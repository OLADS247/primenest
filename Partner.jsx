import { useState } from 'react';
import { api } from '../api.js';
import { PARTNER_TYPES } from '../data.js';

export default function Partner() {
  const [form, setForm] = useState({
    applicant_name: '', business_name: '', email: '', phone: '',
    partner_type: 'Accommodation partner', state: 'Lagos', city: 'Lagos',
    services: '', experience: '', website: '', notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  function set(key, value) { setForm((prev) => ({ ...prev, [key]: value })); }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.createPartner(form);
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
        <div className="kicker">Application received</div>
        <h1>{done.application_id}</h1>
        <p className="lede">Status: {done.status}. Submitting this form does not make a partner verified.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="kicker">Supply</div>
      <h1>Apply to become a partner.</h1>
      <p className="lede">Verification is a review, not a button. PrimeNest does not sell a verified badge.</p>
      <form className="form" onSubmit={submit}>
        {error && <div className="error">{error}</div>}
        <div className="row">
          <label>Your name<input required value={form.applicant_name} onChange={(e) => set('applicant_name', e.target.value)} /></label>
          <label>Business name<input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} /></label>
          <label>Email<input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label>Phone<input required value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label>Partner type
            <select value={form.partner_type} onChange={(e) => set('partner_type', e.target.value)}>
              {PARTNER_TYPES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>State<input value={form.state} onChange={(e) => set('state', e.target.value)} /></label>
          <label>City<input required value={form.city} onChange={(e) => set('city', e.target.value)} /></label>
          <label>Experience<input value={form.experience} onChange={(e) => set('experience', e.target.value)} /></label>
        </div>
        <label>Services<textarea value={form.services} onChange={(e) => set('services', e.target.value)} /></label>
        <button className="primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit application'}</button>
      </form>
    </section>
  );
}
