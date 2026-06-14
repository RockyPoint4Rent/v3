import { useState, useEffect, useCallback } from 'react';
import { Plus, Star, Eye, EyeOff, Trash2, Quote } from 'lucide-react';
import { adminApi } from '../lib/adminApi';
import type { Review } from '../lib/adminApi';
import AdminModal from '../components/AdminModal';

const EMPTY: Omit<Review, 'id' | 'created_at'> = {
  guest_name: '', guest_location: '', property_name: 'Casa Margaritas',
  rating: 5, content: '', is_published: false,
};

const PROPERTIES = ['Casa Margaritas', 'Casa Tropical Mango', 'Casa Delphine'];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)}
          className={`transition-colors ${onChange ? 'cursor-pointer hover:text-sand-500' : 'cursor-default'}`}>
          <Star className={`w-4 h-4 ${n <= value ? 'fill-sand-400 text-sand-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'pending'>('all');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<Omit<Review, 'id' | 'created_at'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await adminApi.reviews.list().catch(() => []);
    setReviews(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (r: Review) => { setForm({ ...r }); setEditing(r); setModal('edit'); };

  const save = async () => {
    if (!form.guest_name.trim() || !form.content.trim()) return;
    setSaving(true);
    if (modal === 'add') {
      await adminApi.reviews.create(form).catch(() => {});
    } else if (editing) {
      await adminApi.reviews.update(editing.id, form).catch(() => {});
    }
    await load();
    setSaving(false);
    setModal(null);
  };

  const togglePublished = async (r: Review) => {
    await adminApi.reviews.update(r.id, { is_published: !r.is_published }).catch(() => {});
    setReviews(prev => prev.map(x => x.id === r.id ? { ...x, is_published: !x.is_published } : x));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await adminApi.reviews.delete(deleteId).catch(() => {});
    setReviews(prev => prev.filter(r => r.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = reviews.filter(r => {
    if (filter === 'published') return r.is_published;
    if (filter === 'pending') return !r.is_published;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.is_published).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-sans text-xl font-semibold text-slate-800">Reviews</h1>
          <p className="font-sans text-sm text-slate-500 font-light mt-0.5">{reviews.length} total · {pendingCount} pending approval</p>
        </div>
        <button type="button" onClick={openAdd}
          className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm px-4 py-2.5 hover:bg-teal-mid transition-colors">
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'published', 'pending'] as const).map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            className={`font-sans text-xs px-3 py-1.5 capitalize transition-colors ${filter === f ? 'bg-teal-deep text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-mid'}`}>
            {f === 'pending' ? `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center"><div className="inline-block w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center">
          <Quote className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-sans text-sm text-slate-400">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`bg-white border ${r.is_published ? 'border-slate-200' : 'border-amber-200 bg-amber-50/30'} p-4`}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-sans text-sm font-semibold text-slate-800">{r.guest_name}</span>
                    {r.guest_location && <span className="font-sans text-xs text-slate-400">{r.guest_location}</span>}
                    <span className="font-sans text-xs bg-ocean-50 text-teal-deep px-2 py-0.5">{r.property_name}</span>
                    <StarRating value={r.rating} />
                    {!r.is_published && (
                      <span className="font-sans text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5">Pending Approval</span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-slate-600 font-light italic leading-relaxed">"{r.content}"</p>
                  <p className="font-sans text-xs text-slate-400 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button type="button" onClick={() => togglePublished(r)} title={r.is_published ? 'Unpublish' : 'Publish'}
                    className={`p-1.5 transition-colors ${r.is_published ? 'text-teal-deep hover:text-slate-400' : 'text-amber-500 hover:text-teal-deep'} hover:bg-slate-100`}>
                    {r.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => openEdit(r)} title="Edit"
                    className="p-1.5 text-slate-400 hover:text-teal-deep hover:bg-slate-100 transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setDeleteId(r.id)} title="Delete"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <AdminModal
          title={modal === 'add' ? 'Add Review' : 'Edit Review'}
          onClose={() => setModal(null)}
          size="md"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={save} disabled={saving}
                className="px-5 py-2 bg-teal-deep text-white font-sans text-sm hover:bg-teal-mid disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Review'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Guest Name *</label>
                <input value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })}
                  placeholder="Miguel" className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Location</label>
                <input value={form.guest_location} onChange={e => setForm({ ...form, guest_location: e.target.value })}
                  placeholder="Phoenix, AZ" className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Property</label>
                <select value={form.property_name} onChange={e => setForm({ ...form, property_name: e.target.value })}
                  className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid bg-white appearance-none">
                  {PROPERTIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Rating</label>
                <div className="py-2"><StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} /></div>
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Review Content *</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                rows={4} placeholder="Guest's review text…"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid resize-none" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm({ ...form, is_published: !form.is_published })}
                className={`w-10 h-6 flex items-center rounded-full transition-colors duration-200 cursor-pointer ${form.is_published ? 'bg-teal-deep' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_published ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="font-sans text-sm text-slate-600">Publish to public site</span>
            </label>
          </div>
        </AdminModal>
      )}

      {deleteId && (
        <AdminModal title="Delete Review?" onClose={() => setDeleteId(null)} size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white font-sans text-sm hover:bg-red-600">Delete</button>
            </div>
          }
        >
          <p className="font-sans text-sm text-slate-600">This will permanently delete the review.</p>
        </AdminModal>
      )}
    </div>
  );
}
