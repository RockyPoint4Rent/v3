import { useState } from 'react';
import { X, Phone, Mail, User, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  onClose: () => void;
}

interface FormState {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  consent: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactRequestModal({ onClose }: Props) {
  const [form, setForm] = useState<FormState>({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    consent: false,
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.from('call_request').insert([{
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      consent: form.consent,
    }]);

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    } else {
      setStatus('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden">
        <div className="bg-teal-deep px-6 py-5 flex items-start justify-between">
          <div>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-sand-200 mb-1">Get In Touch</p>
            <h2 className="font-serif text-2xl text-white">Contact Us Directly</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors mt-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-teal-deep mb-2">Request Received</h3>
            <p className="font-sans text-sm text-slate-500 font-light leading-relaxed">
              Thank you! We'll reach out to you shortly at the contact info you provided.
            </p>
            <button
              onClick={onClose}
              className="mt-6 btn-primary"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-slate-500 block mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Jane"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 font-sans text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-slate-500 block mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Smith"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 font-sans text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-slate-500 block mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 font-sans text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-slate-500 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 font-sans text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    required
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border border-slate-300 peer-checked:bg-teal-deep peer-checked:border-teal-deep transition-colors flex items-center justify-center">
                    {form.consent && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="font-sans text-xs text-slate-500 font-light leading-relaxed">
                  I consent to be contacted by Rocky Point 4 Rentals via automated calls, pre-recorded messages, and/or automated text messages at the phone number provided above. Message and data rates may apply. Consent is not a condition of any purchase. You may opt out at any time by replying STOP.
                </span>
              </label>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-2.5 text-sm font-sans">
                <AlertCircle size={14} />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!form.consent || status === 'loading'}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
