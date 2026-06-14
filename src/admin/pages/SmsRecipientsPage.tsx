import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Phone, AlertCircle, X, Save } from 'lucide-react';
import { adminApi, type SmsRecipient } from '../lib/adminApi';

const MAX_ACTIVE = 5;

function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

function isValidE164(phone: string): boolean {
  return /^\+1\d{10}$/.test(phone);
}

type FormState = { name: string; phone_number: string; is_active: boolean };
const EMPTY_FORM: FormState = { name: '', phone_number: '', is_active: true };

export default function SmsRecipientsPage() {
  const [recipients, setRecipients] = useState<SmsRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeCount = recipients.filter(r => r.is_active).length;

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.smsRecipients.list();
      setRecipients(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(r: SmsRecipient) {
    setEditId(r.id);
    setForm({ name: r.name, phone_number: r.phone_number, is_active: r.is_active });
    setFormError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  async function handleSave() {
    const name = form.name.trim();
    const phone = toE164(form.phone_number.trim());

    if (!name) { setFormError('Name is required.'); return; }
    if (!isValidE164(phone)) {
      setFormError('Enter a valid US phone number, e.g. (602) 555-1234 or +16025551234.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      if (editId) {
        await adminApi.smsRecipients.update(editId, { name, phone_number: phone, is_active: form.is_active });
      } else {
        await adminApi.smsRecipients.create({ name, phone_number: phone, is_active: form.is_active });
      }
      await load();
      closeForm();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(r: SmsRecipient) {
    try {
      await adminApi.smsRecipients.update(r.id, { is_active: !r.is_active });
      setRecipients(prev => prev.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await adminApi.smsRecipients.delete(id);
      setRecipients(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-slate-800 font-light">SMS Notifications</h1>
          <p className="font-sans text-sm text-slate-500 mt-1">
            Additional recipients for new reservation alerts. Up to {MAX_ACTIVE} active numbers.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          disabled={activeCount >= MAX_ACTIVE}
          className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm px-4 py-2.5 hover:bg-teal-mid transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Recipient
        </button>
      </div>

      {/* Owner number notice */}
      <div className="bg-teal-deep/5 border border-teal-mid/20 px-4 py-3 mb-5 flex items-start gap-3">
        <Phone className="w-4 h-4 text-teal-deep flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-sans text-sm text-teal-deep font-medium">Primary owner number</p>
          <p className="font-sans text-xs text-slate-500 mt-0.5">
            Configured via <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">OWNER_PHONE_NUMBER</code> environment variable. Always receives SMS regardless of the list below.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 px-4 py-3 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white border border-slate-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {editId ? 'Edit Recipient' : 'Add Recipient'}
            </h2>
            <button type="button" onClick={closeForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 px-3 py-2.5 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-red-600">{formError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Co-owner, Property Manager"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid bg-white"
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                value={form.phone_number}
                onChange={e => setForm({ ...form, phone_number: e.target.value })}
                placeholder="+16025551234"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid bg-white"
              />
              <p className="font-sans text-xs text-slate-400 mt-1">US numbers only. Stored as E.164.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-checked:bg-teal-deep rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
            <span className="font-sans text-sm text-slate-600">Active — receives SMS notifications</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm px-4 py-2.5 hover:bg-teal-mid transition-colors duration-150 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Recipient'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="font-sans text-sm text-slate-500 hover:text-slate-700 px-4 py-2.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recipients list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-teal-mid border-t-transparent rounded-full animate-spin" />
        </div>
      ) : recipients.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200">
          <Phone className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="font-sans text-sm text-slate-400">No additional recipients yet.</p>
          <p className="font-sans text-xs text-slate-400 mt-1">Add up to {MAX_ACTIVE} phone numbers to receive SMS alerts.</p>
        </div>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-100">
          <div className="px-4 py-2.5 bg-slate-50 grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
            <span className="font-sans text-xs uppercase tracking-wide text-slate-400">Recipient</span>
            <span className="font-sans text-xs uppercase tracking-wide text-slate-400">Status</span>
            <span className="font-sans text-xs uppercase tracking-wide text-slate-400 w-8" />
            <span className="font-sans text-xs uppercase tracking-wide text-slate-400 w-8" />
          </div>
          {recipients.map(r => (
            <div key={r.id} className="px-4 py-3.5 grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-slate-700 truncate">{r.name}</p>
                <p className="font-mono text-xs text-slate-400">{r.phone_number}</p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(r)}
                title={r.is_active ? 'Deactivate' : 'Activate'}
                className="flex items-center gap-1.5 font-sans text-xs transition-colors duration-150"
              >
                {r.is_active ? (
                  <><CheckCircle className="w-4 h-4 text-teal-deep" /><span className="text-teal-deep hidden sm:inline">Active</span></>
                ) : (
                  <><XCircle className="w-4 h-4 text-slate-300" /><span className="text-slate-400 hidden sm:inline">Inactive</span></>
                )}
              </button>

              <button
                type="button"
                onClick={() => openEdit(r)}
                title="Edit"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-teal-deep transition-colors duration-150"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
                title="Delete"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors duration-150 disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeCount >= MAX_ACTIVE && (
        <p className="font-sans text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 mt-3">
          Maximum of {MAX_ACTIVE} active recipients reached. Deactivate or delete one to add another.
        </p>
      )}
    </div>
  );
}
