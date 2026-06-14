import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, CalendarX } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import { adminApi, type BlackoutDate } from '../lib/adminApi';

const PROPERTIES = ['Casa Margaritas', 'Casa Tropical Mango', 'Casa Delphine', 'All Properties'];

const EMPTY = { property_name: 'Casa Margaritas', start_date: '', end_date: '', reason: '' };

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export default function BlackoutDatesPage() {
  const [dates, setDates] = useState<BlackoutDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [propertyFilter, setPropertyFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await adminApi.blackoutDates.list().catch(() => []);
    setDates(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.start_date || !form.end_date) return;
    if (form.end_date < form.start_date) return;
    setSaving(true);
    await adminApi.blackoutDates.create(form);
    await load();
    setSaving(false);
    setModal(false);
    setForm(EMPTY);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await adminApi.blackoutDates.delete(deleteId);
    setDates(prev => prev.filter(d => d.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = propertyFilter === 'all' ? dates : dates.filter(d => d.property_name === propertyFilter);
  const upcoming = filtered.filter(d => d.end_date >= new Date().toISOString().split('T')[0]);
  const past = filtered.filter(d => d.end_date < new Date().toISOString().split('T')[0]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-sans text-xl font-semibold text-slate-800">Blackout Dates</h1>
          <p className="font-sans text-sm text-slate-500 font-light mt-0.5">Block dates when properties are unavailable</p>
        </div>
        <button type="button" onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm px-4 py-2.5 hover:bg-teal-mid transition-colors">
          <Plus className="w-4 h-4" />
          Block Dates
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="font-sans text-xs text-slate-500 uppercase tracking-wide">Filter:</span>
        {['all', ...PROPERTIES].map(p => (
          <button key={p} type="button" onClick={() => setPropertyFilter(p)}
            className={`font-sans text-xs px-3 py-1.5 transition-colors ${propertyFilter === p ? 'bg-teal-deep text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-mid'}`}>
            {p === 'all' ? 'All' : p}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center"><div className="inline-block w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center">
          <CalendarX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-sans text-sm text-slate-400">No blackout dates configured.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-3">Upcoming &amp; Active</p>
              <div className="space-y-2">
                {upcoming.map(d => (
                  <BlackoutRow key={d.id} d={d} onDelete={() => setDeleteId(d.id)} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-3">Past</p>
              <div className="space-y-2 opacity-60">
                {past.map(d => (
                  <BlackoutRow key={d.id} d={d} onDelete={() => setDeleteId(d.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {modal && (
        <AdminModal
          title="Block Dates"
          subtitle="Properties will be marked unavailable for these dates"
          onClose={() => { setModal(false); setForm(EMPTY); }}
          size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setModal(false); setForm(EMPTY); }}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={save} disabled={saving || !form.start_date || !form.end_date}
                className="px-5 py-2 bg-teal-deep text-white font-sans text-sm hover:bg-teal-mid disabled:opacity-50">
                {saving ? 'Saving…' : 'Block Dates'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Property *</label>
              <select value={form.property_name} onChange={e => setForm({ ...form, property_name: e.target.value })}
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid bg-white appearance-none">
                {PROPERTIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Start Date *</label>
                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">End Date *</label>
                <input type="date" value={form.end_date} min={form.start_date}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
              </div>
            </div>
            {form.start_date && form.end_date && form.end_date >= form.start_date && (
              <p className="font-sans text-xs text-teal-mid">{daysBetween(form.start_date, form.end_date)} night{daysBetween(form.start_date, form.end_date) !== 1 ? 's' : ''} blocked</p>
            )}
            <div>
              <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Reason (internal)</label>
              <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                placeholder="e.g. Owner stay, maintenance…"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
            </div>
          </div>
        </AdminModal>
      )}

      {deleteId && (
        <AdminModal title="Remove Blackout Period?" onClose={() => setDeleteId(null)} size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white font-sans text-sm hover:bg-red-600">Remove</button>
            </div>
          }
        >
          <p className="font-sans text-sm text-slate-600">This will remove the date block and allow bookings for those dates again.</p>
        </AdminModal>
      )}
    </div>
  );
}

function BlackoutRow({ d, onDelete }: { d: BlackoutDate; onDelete: () => void }) {
  const nights = daysBetween(d.start_date, d.end_date);
  return (
    <div className="bg-white border border-slate-200 flex items-center gap-4 px-4 py-3">
      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center flex-shrink-0">
        <CalendarX className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-sans text-sm font-medium text-slate-700">{d.property_name}</p>
          <span className="font-sans text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5">{nights} nights blocked</span>
        </div>
        <p className="font-sans text-xs text-slate-500 mt-0.5">
          {d.start_date} – {d.end_date}
          {d.reason && <span className="text-slate-400 ml-2 italic">· {d.reason}</span>}
        </p>
      </div>
      <button type="button" onClick={onDelete}
        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
