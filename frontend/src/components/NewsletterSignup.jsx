import { useState } from 'react';
import { subscribersAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Check, Mail, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export const NewsletterSignup = ({ variant = 'default', interests = [] }) => {
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState(interests);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableInterests = [
    { id: 'sleep', label: 'Sleep & Rest' },
    { id: 'mental-health', label: 'Mental Health' },
    { id: 'productivity', label: 'Productivity' },
  ];

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gdprConsent) {
      toast.error('Please accept the privacy policy to continue');
      return;
    }

    setLoading(true);
    try {
      await subscribersAPI.subscribe({
        email,
        interests: selectedInterests,
        gdpr_consent: gdprConsent,
      });
      setSuccess(true);
      toast.success('Successfully subscribed! Check your inbox.');
    } catch (error) {
      if (error.response?.data?.detail === 'Email already subscribed') {
        toast.error('This email is already subscribed');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`${variant === 'compact' ? 'p-4' : 'p-8'} text-center`}>
        <div className="w-16 h-16 bg-[#7C9A92] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-['Playfair_Display'] text-xl font-semibold mb-2">You're subscribed!</h3>
        <p className="text-[#718096]">
          Thank you for joining. You'll receive our weekly insights soon.
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="space-y-3" data-testid="newsletter-form-compact">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="input-default flex-1 py-2 text-sm"
            data-testid="newsletter-email-input"
          />
          <button
            type="submit"
            disabled={loading || !gdprConsent}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
            data-testid="newsletter-submit-btn"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
          </button>
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox
            checked={gdprConsent}
            onCheckedChange={setGdprConsent}
            className="mt-0.5"
            data-testid="newsletter-gdpr-checkbox"
          />
          <span className="text-xs text-[#718096]">
            I agree to receive emails and accept the{' '}
            <a href="/privacy" className="text-[#7C9A92] underline">privacy policy</a>
          </span>
        </label>
      </form>
    );
  }

  return (
    <div className="newsletter-section rounded-2xl p-8 md:p-12" data-testid="newsletter-section">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-14 h-14 bg-[#7C9A92]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7 text-[#7C9A92]" />
        </div>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold mb-3">
          Weekly Insights Delivered
        </h2>
        <p className="text-[#4A5568] mb-8 text-base md:text-lg">
          Join our community for science-backed tips on sleep, mental health, and productivity.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input-default flex-1"
              data-testid="newsletter-email-input"
            />
            <button
              type="submit"
              disabled={loading || !gdprConsent}
              className="btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="newsletter-submit-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Subscribe'
              )}
            </button>
          </div>

          {/* Interest Selection */}
          <div className="flex flex-wrap justify-center gap-3">
            {availableInterests.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => handleInterestToggle(interest.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedInterests.includes(interest.id)
                    ? 'bg-[#7C9A92] text-white'
                    : 'bg-white text-[#4A5568] hover:bg-stone-100'
                }`}
                data-testid={`interest-${interest.id}`}
              >
                {interest.label}
              </button>
            ))}
          </div>

          {/* GDPR Consent */}
          <label className="flex items-start gap-3 cursor-pointer justify-center">
            <Checkbox
              checked={gdprConsent}
              onCheckedChange={setGdprConsent}
              className="mt-0.5"
              data-testid="newsletter-gdpr-checkbox"
            />
            <span className="text-sm text-[#718096] text-left">
              I agree to receive weekly emails and accept the{' '}
              <a href="/privacy" className="text-[#7C9A92] underline">privacy policy</a>.
              You can unsubscribe at any time.
            </span>
          </label>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;
