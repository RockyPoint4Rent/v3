import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import { adminApi, type Property } from '../lib/adminApi';

const EMPTY: Omit<Property, 'id'> = {
  name: '', tagline: '', description: '', bedrooms: 3, bathrooms: 2,
  max_guests: 6, badge: '', amenities: [], image_url: '', is_active: true, display_order: 0,
};

function PropertyForm({
  value,
  onChange,
}: {
  value: Omit<Property, 'id'>;
  onChange: (v: Omit<Property, 'id'>) => void;
}) {
  const set = (field: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...value, [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };
  const amenityStr = value.amenities.join(', ');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Property Name *</label>
          <input value={value.name} onChange={set('name')} placeholder="Casa Margaritas"
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Badge Label</label>
          <input value={value.badge} onChange={set('badge')} placeholder="Most Popular"
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
        </div>
      </div>

      <div>
        <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Tagline</label>
        <input value={value.tagline} onChange={set('tagline')} placeholder="Short marketing line"
          className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
      </div>

      <div>
        <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Description</label>
        <textarea value={value.description} onChange={set('description')} rows={3} placeholder="Full description…"
          className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Bedrooms</label>
          <input type="number" min={1} step={0.5} value={value.bedrooms} onChange={set('bedrooms')}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Bathrooms</label>
          <input type="number" min={1} step={0.5} value={value.bathrooms} onChange={set('bathrooms')}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Max Guests</label>
          <input type="number" min={1} value={value.max_guests} onChange={set('max_guests')}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
        </div>
      </div>

      <div>
        <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">
          Amenities <span className="normal-case text-slate-400">(comma-separated)</span>
        </label>
        <input
          value={amenityStr}
          onChange={e => onChange({ ...value, amenities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          placeholder="A/C, WiFi, Full Kitchen, Parking"
          className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid"
        />
      </div>

      <div>
        <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Image URL</label>
        <input value={value.image_url} onChange={set('image_url')} placeholder="https://images.pexels.com/…"
          className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
        {value.image_url && (
          <img src={value.image_url} alt="preview" className="mt-2 w-full h-28 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-xs uppercase tracking-wide text-slate-500 mb-1.5">Display Order</label>
          <input type="number" min={0} value={value.display_order} onChange={set('display_order')}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-mid" />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => onChange({ ...value, is_active: !value.is_active })}
              className={`w-10 h-6 flex items-center rounded-full transition-colors duration-200 cursor-pointer ${value.is_active ? 'bg-teal-deep' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="font-sans text-sm text-slate-600">{value.is_active ? 'Active (visible)' : 'Hidden'}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState<Omit<Property, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await adminApi.properties.list().catch(() => []);
    setProperties(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (p: Property) => { setForm({ ...p }); setEditing(p); setModal('edit'); };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (modal === 'add') {
      await adminApi.properties.create(form);
    } else if (editing) {
      await adminApi.properties.update(editing.id, form);
    }
    await load();
    setSaving(false);
    setModal(null);
  };

  const toggleActive = async (p: Property) => {
    await adminApi.properties.update(p.id, { is_active: !p.is_active });
    setProperties(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await adminApi.properties.delete(deleteId);
    setProperties(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-sans text-xl font-semibold text-slate-800">Properties</h1>
          <p className="font-sans text-sm text-slate-500 font-light mt-0.5">{properties.length} properties configured</p>
        </div>
        <button type="button" onClick={openAdd}
          className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm px-4 py-2.5 hover:bg-teal-mid transition-colors">
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center"><div className="inline-block w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {properties.map(p => (
            <div key={p.id} className={`bg-white border ${p.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60'} flex items-center gap-4 p-4`}>
              <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 cursor-grab" />
              <div className="w-16 h-12 bg-slate-100 flex-shrink-0 overflow-hidden">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-sans text-sm font-semibold text-slate-800">{p.name}</p>
                  {p.badge && <span className="font-sans text-xs bg-ocean-50 text-teal-deep px-2 py-0.5">{p.badge}</span>}
                  {!p.is_active && <span className="font-sans text-xs bg-slate-100 text-slate-500 px-2 py-0.5">Hidden</span>}
                </div>
                <p className="font-sans text-xs text-slate-500 font-light mt-0.5 truncate">{p.tagline}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="font-sans text-xs text-slate-400">{p.bedrooms} bed · {p.bathrooms} bath · {p.max_guests} guests</span>
                  <div className="flex flex-wrap gap-1">
                    {(p.amenities || []).slice(0, 3).map(a => (
                      <span key={a} className="font-sans text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5">{a}</span>
                    ))}
                    {(p.amenities || []).length > 3 && <span className="font-sans text-xs text-slate-400">+{p.amenities.length - 3}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={() => toggleActive(p)} title={p.is_active ? 'Hide' : 'Show'}
                  className="p-1.5 text-slate-400 hover:text-teal-deep hover:bg-slate-100 transition-colors">
                  {p.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => openEdit(p)} title="Edit"
                  className="p-1.5 text-slate-400 hover:text-teal-deep hover:bg-slate-100 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setDeleteId(p.id)} title="Delete"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <AdminModal
          title={modal === 'add' ? 'Add Property' : 'Edit Property'}
          subtitle={modal === 'edit' ? editing?.name : undefined}
          onClose={() => setModal(null)}
          size="lg"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={save} disabled={saving}
                className="px-5 py-2 bg-teal-deep text-white font-sans text-sm hover:bg-teal-mid disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Property'}
              </button>
            </div>
          }
        >
          <PropertyForm value={form} onChange={setForm} />
        </AdminModal>
      )}

      {deleteId && (
        <AdminModal title="Delete Property?" subtitle="This action cannot be undone." onClose={() => setDeleteId(null)} size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="px-4 py-2 font-sans text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white font-sans text-sm hover:bg-red-600">Delete</button>
            </div>
          }
        >
          <p className="font-sans text-sm text-slate-600">Are you sure you want to delete this property? All associated data will remain but the property will be removed from the dashboard.</p>
        </AdminModal>
      )}
    </div>
  );
}
