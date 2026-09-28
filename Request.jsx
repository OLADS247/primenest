import { useState } from 'react';
import { api } from '../api.js';
import { ACCOMMODATION_TYPES, CUSTOMER_TYPES } from '../data.js';

const start = {
  customer_name: '',
  email: '',
  phone: '',
  preferred_contact: 'WhatsApp',
  customer_type: 'Student',
  country: 'Nigeria',
  state: 'Lagos',
  city: 'Lagos',
  area: '',
  institution: '',
  campus: '',
  accommodation_type: 'Apartment',
  bedrooms: '1',
  budget: '',
  currency: 'NGN',
  furnished: 'Furnished',
  move_in_date: '',
  duration: '',
  notes: ''
};

export default function Request({ setPage }) {
  const [form, setForm] = useState(start);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.createRequest({ ...form, budget: Number(form.budget) });
      setDone(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <section className="result panel">
        <div className="kicker">Request received</div>
        <h1>Your request has an ID.</h1>
        <p className="ref">{done.request_id}</p>
        <p className="lede">Status: {done.status}. {done.next_step}</p>
        <div className="warn">Payment is not live. PrimeNest will not ask you to pay a personal account.</div>
        <div className="actions">
          <button className="primary" onClick={() => setPage('track')}>Track this request</button>
          <button className="ghost" onClick={() => { setDone(null); setForm(start); }}>Submit another</button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="kicker">Request accommodation</div>
      <h1>Tell PrimeNest what you need.</h1>
      <p className="lede">This creates a real record on the PrimeNest server. It does not book a room by itself.</p>
      <form className="form" onSubmit={submit}>
        {error && <div className="error">{error}</div>}
        <div className="row">
          <label>Full name<input required value={form.customer_name} onChange={(e) => set('customer_name', e.target.value)} /></label>
          <label>Email<input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label>Phone<input required value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label>Preferred contact
            <select value={form.preferred_contact} onChange={(e) => set('preferred_contact', e.target.value)}>
              <option>WhatsApp</option><option>Phone</option><option>Email</option>
            </select>
          </label>
          <label>I am a
            <select value={form.customer_type} onChange={(e) => set('customer_type', e.target.value)}>
              {CUSTOMER_TYPES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Country<input value={form.country} onChange={(e) => set('country', e.target.value)} /></label>
          <label>State<input required value={form.state} onChange={(e) => set('state', e.target.value)} /></label>
          <label>City<input required value={form.city} onChange={(e) => set('city', e.target.value)} /></label>
          <label>Area<input value={form.area} onChange={(e) => set('area', e.target.value)} /></label>
          <label>Accommodation
            <select value={form.accommodation_type} onChange={(e) => set('accommodation_type', e.target.value)}>
              {ACCOMMODATION_TYPES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Bedrooms<input value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} /></label>
          <label>Budget<input required type="number" min="1" value={form.budget} onChange={(e) => set('budget', e.target.value)} /></label>
          <label>Currency
            <select value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              <option>NGN</option><option>EUR</option><option>USD</option>
            </select>
          </label>
          <label>Furnished
            <select value={form.furnished} onChange={(e) => set('furnished', e.target.value)}>
              <option>Furnished</option><option>Unfurnished</option><option>Either</option>
            </select>
          </label>
          <label>Move-in date<input type="date" value={form.move_in_date} onChange={(e) => set('move_in_date', e.target.value)} /></label>
          <label>Duration<input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="12 months" /></label>
        </div>
        {form.customer_type === 'Student' && (
          <div className="row">
            <label>Institution<input value={form.institution} onChange={(e) => set('institution', e.target.value)} /></label>
            <label>Campus<input value={form.campus} onChange={(e) => set('campus', e.target.value)} /></label>
          </div>
        )}
        <label>Notes<textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} /></label>
        <button className="primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit request'}</button>
      </form>
    </section>
  );
}
