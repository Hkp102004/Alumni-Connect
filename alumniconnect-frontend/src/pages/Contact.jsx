import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in name, email, and message fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-hero">
          <span className="contact-badge">Contact Us</span>
          <h1>Get in Touch with Lumnus</h1>
          <p className="contact-subtitle">
            Have questions about student onboarding, partnerships, or features? Send us a message and we'll reply shortly.
          </p>
        </div>

        <div className="contact-layout">
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <h3>Message Sent Successfully!</h3>
                <p>Thank you, {form.name}. Our support team will get back to you shortly at {form.email}.</p>
                <button type="button" className="btn-primary" onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Divya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="e.g. divya@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="e.g. Campus Onboarding Query"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Describe your inquiry..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary contact-submit-btn">
                  Submit Form
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
