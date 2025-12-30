import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div data-testid="contact-page">
      {/* Breadcrumb */}
      <div className="bg-[#FAFAF9] py-4 border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#718096] hover:text-[#7C9A92]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#718096]" />
            <span className="text-[#2D3748] font-medium">Contact</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 md:py-16 bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-14 h-14 bg-[#7C9A92]/10 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-7 h-7 text-[#7C9A92]" />
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#2D3748] mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-[#4A5568]">
            Have a question or suggestion? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#48BB78] rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#2D3748] mb-4">
                Message Sent!
              </h2>
              <p className="text-[#718096] mb-6">
                Thank you for reaching out. We'll get back to you as soon as possible.
              </p>
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-default w-full"
                    data-testid="contact-name-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-default w-full"
                    data-testid="contact-email-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-default w-full"
                  data-testid="contact-subject-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-default w-full resize-none"
                  data-testid="contact-message-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
                data-testid="contact-submit-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
