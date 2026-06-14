import { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';
import { adminApi, type RateSetting } from '../lib/adminApi';

const DAY_ROWS = [
  { key: 'fri_sat_rate' as const, label: 'Friday & Saturday', desc: 'Peak weekend rate', days: ['Fri', 'Sat'] },
  { key: 'sun_wed_rate' as const, label: 'Sunday – Wednesday', desc: 'Midweek rate', days: ['Sun', 'Mon', 'Tue', 'Wed'] },
  { key: 'thu_rate' as const, label: 'Thursday', desc: 'Pre-weekend rate', days: ['Thu'] },
];

const FEE_ROWS = [
  { key: 'cleaning_fee' as const, label: 'Cleaning Fee', desc: 'One-time per stay' },
  { key: 'property_fee' as const, label: 'Property Fee', desc: 'Service & maintenance' },
  { key: 'deposit_amount' as const, label: 'Reservation Deposit', desc: 'Required to confirm booking' },
];

export default function RatesFeesPage() {
  const [settings, setSettings] = useState<RateSetting | null>(null);
  const [form, setForm] = useState<Omit<RateSetting, 'id'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.rateSettings.get().then(data => {
      setSettings(data);
      if (data) setForm({ ...data });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const setField = (key: keyof Omit<RateSetting, 'id' | 'property_name'>, val: number) => {
    setForm(prev => prev ? { ...prev, [key]: val } : prev);
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    if (settings) {
      await adminApi.rateSettings.update(settings.id, form);
    } else {
      const created = await adminApi.rateSettings.create({ ...form, property_name: 'global' });
      setSettings(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="p-12 text-center"><div className="inline-block w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-sans text-xl font-semibold text-slate-800">Rates &amp; Fees</h1>
          <p className="font-sans text-sm text-slate-500 font-light mt-0.5">Configure nightly rates and fees applied across all properties</p>
        </div>
        <button type="button" onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm px-4 py-2.5 hover:bg-teal-mid transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {form && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <h2 className="font-sans text-sm font-semibold text-slate-700">Nightly Rates</h2>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                <div className="absolute left-5 top-0 hidden group-hover:block bg-slate-800 text-white text-xs px-3 py-2 w-56 z-10 font-light">
                  Rates are applied per night based on the day of the week.
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {DAY_ROWS.map(({ key, label, desc, days }) => (
                <div key={key} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex gap-1 flex-shrink-0">
                    {days.map(d => (
                      <span key={d} className="font-sans text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 font-medium">{d}</span>
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-sm font-medium text-slate-700">{label}</p>
                    <p className="font-sans text-xs text-slate-400 font-light">{desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm text-slate-500">$</span>
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={form[key]}
                      onChange={e => setField(key, Number(e.target.value))}
                      className="w-24 border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 text-right focus:outline-none focus:border-teal-mid"
                    />
                    <span className="font-sans text-xs text-slate-400">/ night</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-sans text-sm font-semibold text-slate-700">Fees &amp; Deposit</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {FEE_ROWS.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1">
                    <p className="font-sans text-sm font-medium text-slate-700">{label}</p>
                    <p className="font-sans text-xs text-slate-400 font-light">{desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm text-slate-500">$</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={form[key]}
                      onChange={e => setField(key, Number(e.target.value))}
                      className="w-24 border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 text-right focus:outline-none focus:border-teal-mid"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sand-50 border border-sand-200 p-4">
            <p className="font-sans text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Example 3-Night Stay Preview</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span className="font-light">1× Fri/Sat night</span>
                <span>${form.fri_sat_rate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-light">1× Thursday night</span>
                <span>${form.thu_rate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-light">1× Sun–Wed night</span>
                <span>${form.sun_wed_rate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-light">Cleaning fee</span>
                <span>${form.cleaning_fee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-light">Property fee</span>
                <span>${form.property_fee}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-800 border-t border-sand-300 pt-1.5 mt-1.5">
                <span>Total</span>
                <span>${(form.fri_sat_rate + form.thu_rate + form.sun_wed_rate + form.cleaning_fee + form.property_fee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-teal-deep text-xs pt-1">
                <span className="font-medium">Deposit required</span>
                <span className="font-semibold">${form.deposit_amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
