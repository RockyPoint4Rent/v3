import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, HelpCircle, Eye, EyeOff, GripVertical } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import { adminApi, type Faq } from '../lib/adminApi';

const EMPTY: Omit<Faq, 'id' | 'created_at'> = {
  question: '', answer: '', display_order: 0, is_published: true,
};

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<Omit<Faq, 'id' | 'created_at'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await adminApi.faqs.list().catch(() => []);
    setFaqs(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    const maxOrder = Math.max(0, ...faqs.map(f => f.display_order));
    setForm({ ...EMPTY, display_order: maxOrder + 1 });
    setEditing(null);
    setModal('add');
  };

  const openEdit = (f: Faq) => { setForm({ ...f }); setEditing(f); setModal('edit'); };

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    if (modal === 'add') {
      await adminApi.faqs.create(form);
    } else if (editing) {
      await adminApi.faqs.update(editing.id, form);
    }
    await load();
    setSaving(false);
    setModal(null);
  };

  const togglePublished = async (f: Faq) => {
    await adminApi.faqs.update(f.id, { is_published: !f.is_published });
    setFaqs(prev => prev.map(x => x.id === f.id ? { ...x, is_published: !x.is_published } : x));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await adminApi.faqs.delete(deleteId);
    setFaqs(prev => prev.filter(f => f.id !== deleteId));
    setDeleteId(null);
  };

  const publishedCount = faqs.filter(f => f.is_published).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-sans text-xl font-semibold text-slate-800">FAQs</h1>
          <p className="font-sans text-sm text-slate-500 font-light mt-0.5">{faqs.length} questions · {publishedCount} published</p>
        </div>
        <button type="button" onClick={openAdd}
          className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm px-4 py-2.5 hover:bg-teal-mid transition-colors">
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center"><div className="inline-block w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" /></div>
      ) : faqs.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-sans text-sm text-slate-400">No FAQs added yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((f, idx) => (
            <div key={f.id} className={`bg-white border ${f.is_published ? 'border-slate-200' : 'border-slate-100 opacity-60'} p-4`}>
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1 cursor-grab" />
                <div className="w-6 h-6 bg-teal-deep/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-sans text-xs font-bold text-teal-deep">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1.5">
                    <p className="font-sans text-sm font-semibold text-slate-800 flex-1">{f.question}</p>
                    {!f.is_published && (
                      <span className="font-sans text-xs bg-slate-100 text-slate-500 px-2 py-0.5 whitespace-nowrap">Hidden</span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-slate-500 font-light leading-relaxed line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <button type="button" onClick={() => togglePublished(f)} title={f.is_published ? 'Hide' : 'Publish'}
                    className={`p-1.5 transition-colors ${f.is_published ? 'text-teal-deep' : 'text-slate-400'} hover:bg-slate-100`}>
                    {f.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => openEdit(f)} title="Edit"
                    className="p-1.5 text-slate-400 hover:text-teal-deep hover:bg-slate-100 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setDeleteId(f.id)} title="Delete"
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
          title={modal === 'add' ? 'Add FAQ' : 'Edit FAQ'}
          onClose={() => setModal(null)}
          size="md"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={save} disabled={saving}
                className="px-5 py-2 bg-teal-deep text-white font-sans text-sm hover:bg-teal-mid disabled:opacity-50">
                {saving ? 'Saving…' : 'Save FAQ'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Question *</label>
              <input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                placeholder="How close are properties to the beach?"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Answer *</label>
              <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })}
                rows={5} placeholder="All properties are within 6 minutes of the beach…"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Display Order</label>
                <input type="number" min={0} value={form.display_order}
                  onChange={e => setForm({ ...form, display_order: Number(e.target.value) })}
                  className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setForm({ ...form, is_published: !form.is_published })}
                    className={`w-10 h-6 flex items-center rounded-full transition-colors duration-200 cursor-pointer ${form.is_published ? 'bg-teal-deep' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_published ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="font-sans text-sm text-slate-600">{form.is_published ? 'Published' : 'Hidden'}</span>
                </label>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {deleteId && (
        <AdminModal title="Delete FAQ?" onClose={() => setDeleteId(null)} size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white font-sans text-sm hover:bg-red-600">Delete</button>
            </div>
          }
        >
          <p className="font-sans text-sm text-slate-600">This will permanently delete this FAQ from the site.</p>
        </AdminModal>
      )}
    </div>
  );
}
