import { useState } from 'react';
import { api } from './api.js';
import { ACCOMMODATION_TYPES, CUSTOMER_TYPES } from './data.js';

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

export default function Request() {
  const [form, setForm] = useState(start);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null
      };

      const result = await api.createRequest(payload);

      setSuccess({
        message:
          result?.message ||
          'Your accommodation request has been submitted successfully.',
        requestId:
          result?.request_id ||
          result?.requestId ||
          result?.id ||
          null
      });

      setForm(start);
    } catch (err) {
      setError(
        err?.message ||
          'We could not submit your request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="request-page">
      <div className="request-container">
        <div className="request-header">
          <span className="request-eyebrow">PRIMENEST</span>

          <h1>Request Accommodation</h1>

          <p>
            Tell us what you need, where you need it, and your preferred
            budget. Our team will review your request and assist you with
            suitable accommodation options.
          </p>
        </div>

        {success && (
          <div className="request-alert request-success" role="status">
            <strong>Request submitted successfully.</strong>

            <p>{success.message}</p>

            {success.requestId && (
              <p>
                <strong>Request ID:</strong> {success.requestId}
              </p>
            )}

            <p>
              Please keep your Request ID for tracking and future
              communication with PrimeNest.
            </p>
          </div>
        )}

        {error && (
          <div className="request-alert request-error" role="alert">
            {error}
          </div>
        )}

        <form className="request-form" onSubmit={handleSubmit}>
          <div className="request-section">
            <div className="request-section-heading">
              <span>01</span>
              <div>
                <h2>Your Information</h2>
                <p>Tell us how we can reach you.</p>
              </div>
            </div>

            <div className="request-grid">
              <div className="form-field">
                <label htmlFor="customer_name">
                  Full Name <span>*</span>
                </label>

                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="customer_type">
                  I am a <span>*</span>
                </label>

                <select
                  id="customer_type"
                  name="customer_type"
                  value={form.customer_type}
                  onChange={handleChange}
                  required
                >
                  {CUSTOMER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="email">
                  Email Address <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">
                  Phone Number <span>*</span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="preferred_contact">
                  Preferred Contact Method <span>*</span>
                </label>

                <select
                  id="preferred_contact"
                  name="preferred_contact"
                  value={form.preferred_contact}
                  onChange={handleChange}
                  required
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="WhatsApp and Email">
                    WhatsApp and Email
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="request-section">
            <div className="request-section-heading">
              <span>02</span>
              <div>
                <h2>Preferred Location</h2>
                <p>Where do you need accommodation?</p>
              </div>
            </div>

            <div className="request-grid">
              <div className="form-field">
                <label htmlFor="country">
                  Country <span>*</span>
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="state">
                  State <span>*</span>
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="e.g. Lagos"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="city">
                  City <span>*</span>
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Lagos"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="area">Preferred Area</label>

                <input
                  id="area"
                  name="area"
                  type="text"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="e.g. Yaba, Ikeja, Lekki"
                />
              </div>

              <div className="form-field">
                <label htmlFor="institution">School / Institution</label>

                <input
                  id="institution"
                  name="institution"
                  type="text"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="Enter institution name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="campus">Campus</label>

                <input
                  id="campus"
                  name="campus"
                  type="text"
                  value={form.campus}
                  onChange={handleChange}
                  placeholder="e.g. Main Campus"
                />
              </div>
            </div>
          </div>

          <div className="request-section">
            <div className="request-section-heading">
              <span>03</span>
              <div>
                <h2>Accommodation Requirements</h2>
                <p>Help us understand exactly what you are looking for.</p>
              </div>
            </div>

            <div className="request-grid">
              <div className="form-field">
                <label htmlFor="accommodation_type">
                  Accommodation Type <span>*</span>
                </label>

                <select
                  id="accommodation_type"
                  name="accommodation_type"
                  value={form.accommodation_type}
                  onChange={handleChange}
                  required
                >
                  {ACCOMMODATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="bedrooms">
                  Bedrooms <span>*</span>
                </label>

                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  required
                >
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="budget">
                  Maximum Budget <span>*</span>
                </label>

                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="Enter your budget"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="currency">Currency</label>

                <select
                  id="currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="NGN">NGN — Nigerian Naira</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="furnished">
                  Furnishing Preference <span>*</span>
                </label>

                <select
                  id="furnished"
                  name="furnished"
                  value={form.furnished}
                  onChange={handleChange}
                  required
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Either">Either</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="move_in_date">
                  Preferred Move-in Date <span>*</span>
                </label>

                <input
                  id="move_in_date"
                  name="move_in_date"
                  type="date"
                  value={form.move_in_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="duration">Expected Duration</label>

                <select
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                >
                  <option value="">Select duration</option>
                  <option value="Less than 3 months">
                    Less than 3 months
                  </option>
                  <option value="3 - 6 months">3 - 6 months</option>
                  <option value="6 - 12 months">6 - 12 months</option>
                  <option value="1 year">1 year</option>
                  <option value="More than 1 year">
                    More than 1 year
                  </option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          <div className="request-section">
            <div className="request-section-heading">
              <span>04</span>
              <div>
                <h2>Additional Information</h2>
                <p>Anything else our team should know?</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="notes">Additional Notes</label>

              <textarea
                id="notes"
                name="notes"
                rows="6"
                value={form.notes}
                onChange={handleChange}
                placeholder="Tell us about any special requirements, preferred neighbourhoods, accessibility needs, or other details..."
              />
            </div>
          </div>

          <div className="request-footer">
            <p>
              By submitting this request, you are asking PrimeNest to review
              your accommodation requirements and contact you using your
              preferred contact method.
            </p>

            <button
              type="submit"
              className="request-submit"
              disabled={loading}
            >
              {loading ? 'Submitting Request...' : 'Submit Accommodation Request'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
