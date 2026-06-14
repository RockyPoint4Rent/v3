import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, DollarSign, Clock, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    dates: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    await supabase.from('contact_inquiries').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      property: form.property,
      dates: form.dates.trim(),
      message: form.message.trim(),
    });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    await fetch(`${supabaseUrl}/functions/v1/notify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'contact_inquiry', inquiry: form }),
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-teal-deep">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-sand-400 mb-4">
              Get in Touch
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
              Start Planning
              <br />
              <em className="text-sand-300">Your Escape</em>
            </h2>
            <div className="w-16 h-px bg-sand-400/60 mb-8" />

            <p className="font-sans text-white/70 leading-relaxed mb-10 font-light">
              Contact us and we'll get back to you within 24 hours with
              availability and pricing for your preferred dates.
            </p>

            <div className="flex flex-col gap-5 mb-10">
              <a
                href="mailto:reservations@rockypoint4rent.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-sand-400 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-white/60 group-hover:text-sand-300 transition-colors duration-300" />
                </div>
                <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                  reservations@rockypoint4rent.com
                </span>
              </a>

              <a
                href="tel:+14802070114"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-sand-400 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-white/60 group-hover:text-sand-300 transition-colors duration-300" />
                </div>
                <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                  +1 (480) 207-0114
                </span>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white/60" />
                </div>
                <span className="font-sans text-sm text-white/70">
                  Mesa, AZ 85210
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-4 border border-white/10 bg-white/5 text-center">
                <DollarSign className="w-5 h-5 text-sand-400 mx-auto mb-2" />
                <div className="font-sans text-sm font-medium text-white mb-0.5">$200 Deposit</div>
                <div className="font-sans text-xs text-white/40 font-light">Pay rest on arrival</div>
              </div>
              <div className="p-4 border border-white/10 bg-white/5 text-center">
                <Clock className="w-5 h-5 text-sand-400 mx-auto mb-2" />
                <div className="font-sans text-sm font-medium text-white mb-0.5">24hr Response</div>
                <div className="font-sans text-xs text-white/40 font-light">Quick availability check</div>
              </div>
              <div className="p-4 border border-white/10 bg-white/5 text-center">
                <Shield className="w-5 h-5 text-sand-400 mx-auto mb-2" />
                <div className="font-sans text-sm font-medium text-white mb-0.5">Verified Hosts</div>
                <div className="font-sans text-xs text-white/40 font-light">100+ happy guests</div>
              </div>
            </div>

            <div className="p-5 border border-white/10 bg-white/5">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-5 h-5 text-sand-400" />
                <span className="font-sans text-sm font-medium text-white">
                  Co-Host: Tomas Nieva
                </span>
              </div>
              <p className="font-sans text-xs text-white/50 font-light">
                We accept Zelle. Secure your dates with only $200 — pay the
                rest when you arrive.
              </p>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/10 bg-white/5">
                <div className="w-16 h-16 bg-sand-400/20 rounded-full flex items-center justify-center mb-6">
                  <Send className="w-7 h-7 text-sand-400" />
                </div>
                <h3 className="font-serif text-2xl font-light text-white mb-3">
                  Message Sent!
                </h3>
                <p className="font-sans text-white/60 font-light text-sm leading-relaxed">
                  Thank you for reaching out. We'll get back to you within 24 hours
                  with availability and details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Smith"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 font-sans text-sm px-4 py-3 focus:outline-none focus:border-sand-400 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 font-sans text-sm px-4 py-3 focus:outline-none focus:border-sand-400 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 font-sans text-sm px-4 py-3 focus:outline-none focus:border-sand-400 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                      Property
                    </label>
                    <select
                      name="property"
                      value={form.property}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white font-sans text-sm px-4 py-3 focus:outline-none focus:border-sand-400 transition-colors duration-200 appearance-none"
                    >
                      <option value="" className="bg-teal-deep">Select a property</option>
                      <option value="margaritas" className="bg-teal-deep">Casa Margaritas</option>
                      <option value="mango" className="bg-teal-deep">Casa Tropical Mango</option>
                      <option value="delphine" className="bg-teal-deep">Casa Delphine</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                    Preferred Dates
                  </label>
                  <input
                    type="text"
                    name="dates"
                    value={form.dates}
                    onChange={handleChange}
                    placeholder="e.g. July 4–8, 2025"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 font-sans text-sm px-4 py-3 focus:outline-none focus:border-sand-400 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your group size, any special requests..."
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 font-sans text-sm px-4 py-3 focus:outline-none focus:border-sand-400 transition-colors duration-200 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-white/10 border border-red-400/30 px-3 py-2">{error}</p>
                )}
                <button type="submit" disabled={submitting} className="btn-primary bg-sand-400 border-none !text-teal-deep hover:!bg-sand-300 hover:!shadow-xl mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Sending…' : 'Send Inquiry'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
