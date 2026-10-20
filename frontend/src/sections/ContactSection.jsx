import { useState } from 'react';
import { api } from '../api/client.js';
import SectionHeading from '../components/SectionHeading.jsx';
import './Contact.css';

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' };

export default function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const res = await api.sendContact({ ...form, phone: form.phone || null });
      setStatus({ state: 'success', message: res.detail });
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <section id="contact" className="section section--stone">
      <div className="container">
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact Us"
          intro="Tell us about your site, your plans and your timeline — we'd love to hear from you."
        />
        <div className="contact">
          <aside className="contact__info">
            <h2>Studio</h2>
            <p>Pune, Maharashtra, India</p>
            <h2>Email</h2>
            <p>
              <a href="mailto:hello@matiiarchitects.com">hello@matiiarchitects.com</a>
            </p>
            <h2>Hours</h2>
            <p>Mon – Sat, 10am – 6pm</p>
          </aside>

          <form className="contact__form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required minLength={2} />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              <span>
                Phone <span className="optional">(optional)</span>
              </span>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={20} />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
              />
            </label>

            <button type="submit" className="btn" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            {status.message && (
              <p className={`contact__status contact__status--${status.state}`} role="status">
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
