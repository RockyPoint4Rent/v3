import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Eye, Phone, Mail, X, Send, CheckCircle, ChevronRight, Pencil, Check, AlertTriangle, MailCheck } from 'lucide-react';
import { adminApi } from '../lib/adminApi';
import type { Reservation, BookingStatus } from '../lib/adminApi';
import { STATUS_LABELS } from '../../lib/supabase';
import StatusBadge from '../components/StatusBadge';
import AdminModal from '../components/AdminModal';

const ALL_STATUSES: BookingStatus[] = ['pending', 'deposit_paid', 'confirmed', 'balance_due', 'fully_paid', 'cancelled'];

// Inline action each status can take to advance forward
const STATUS_ACTIONS: Partial<Record<BookingStatus, { label: string; next: BookingStatus; style: string; sendEmail?: boolean }>> = {
  pending: {
    label: 'Mark Deposit Paid',
    next: 'deposit_paid',
    style: 'bg-teal-deep text-white hover:bg-teal-mid',
    sendEmail: true,
  },
  deposit_paid: {
    label: 'Confirm Booking',
    next: 'confirmed',
    style: 'bg-emerald-600 text-white hover:bg-emerald-700',
    sendEmail: true,
  },
  confirmed: {
    label: 'Mark Balance Due',
    next: 'balance_due',
    style: 'bg-orange-500 text-white hover:bg-orange-600',
  },
  balance_due: {
    label: 'Mark Fully Paid',
    next: 'fully_paid',
    style: 'bg-emerald-600 text-white hover:bg-emerald-700',
  },
};

function guestFullName(r: Reservation) {
  return `${r.guest_first_name ?? ''} ${r.guest_last_name ?? ''}`.trim();
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [sendingOwnerNotif, setSendingOwnerNotif] = useState(false);
  const [ownerNotifResult, setOwnerNotifResult] = useState<{ id: string; to: string[] } | null>(null);
  const [ownerNotifError, setOwnerNotifError] = useState('');
  const [editingContact, setEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ email: '', phone: '' });
  const [savingContact, setSavingContact] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await adminApi.reservations.list().catch(() => []);
    setReservations(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDetail = (r: Reservation) => {
    setSelected(r);
    setEmailSent(null);
    setEmailError('');
    setEditingContact(false);
    setOwnerNotifResult(null);
    setOwnerNotifError('');
  };

  const saveContact = async () => {
    if (!selected) return;
    setSavingContact(true);
    await adminApi.reservations.update(selected.id, {
      guest_email: contactForm.email,
      guest_phone: contactForm.phone,
    }).catch(() => {});
    const updated = { ...selected, guest_email: contactForm.email, guest_phone: contactForm.phone };
    setSelected(updated);
    setReservations(prev => prev.map(r => r.id === selected.id ? updated : r));
    setSavingContact(false);
    setEditingContact(false);
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    setStatusUpdating(id);
    await adminApi.reservations.update(id, { status }).catch(() => {});
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    setStatusUpdating(null);
  };

  const advanceStatus = async (r: Reservation) => {
    const action = STATUS_ACTIONS[r.status];
    if (!action) return;
    if (action.sendEmail) {
      await sendConfirmation(r.id, action.next);
    } else {
      await updateStatus(r.id, action.next);
    }
  };

  const sendConfirmation = async (id: string, forceStatus?: BookingStatus) => {
    setSendingEmail(true);
    setEmailError('');
    try {
      await adminApi.reservations.sendConfirmation(id, forceStatus);
      setEmailSent(id);
      const newStatus = forceStatus ?? 'confirmed';
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to send');
    }
    setSendingEmail(false);
  };

  const sendOwnerNotification = async (id: string) => {
    setSendingOwnerNotif(true);
    setOwnerNotifError('');
    setOwnerNotifResult(null);
    try {
      const result = await adminApi.reservations.sendOwnerNotification(id);
      setOwnerNotifResult({ id: result.id ?? '', to: result.to ?? [] });
      // Refresh the reservation so notification_email_sent_at updates
      const refreshed = await adminApi.reservations.list().catch(() => null);
      if (refreshed) {
        setReservations(refreshed);
        const updatedSelected = refreshed.find(r => r.id === id);
        if (updatedSelected) setSelected(updatedSelected);
      }
    } catch (err) {
      setOwnerNotifError(err instanceof Error ? err.message : 'Failed to send');
    }
    setSendingOwnerNotif(false);
  };

  const properties = ['all', ...Array.from(new Set(reservations.map(r => r.property_name)))];

  const q = search.toLowerCase();
  const filtered = reservations.filter(r => {
    const matchSearch = q === '' ||
      guestFullName(r).toLowerCase().includes(q) ||
      (r.guest_email ?? '').toLowerCase().includes(q) ||
      (r.property_name ?? '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchProp = propertyFilter === 'all' || r.property_name === propertyFilter;
    return matchSearch && matchStatus && matchProp;
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-sans text-xl font-semibold text-slate-800">Reservations</h1>
          <p className="font-sans text-sm text-slate-500 font-light mt-0.5">
            {reservations.length} total · {reservations.filter(r => r.status === 'pending').length} pending action
          </p>
        </div>
      </div>

      {/* Workflow guide */}
      <div className="bg-ocean-50 border border-teal-100 p-4 mb-5">
        <p className="font-sans text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Booking Workflow</p>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {(['pending', 'deposit_paid', 'confirmed', 'balance_due', 'fully_paid'] as BookingStatus[]).map((s, i, arr) => (
            <span key={s} className="flex items-center gap-1.5">
              <StatusBadge status={s} />
              {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
            </span>
          ))}
        </div>
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          Emails are sent automatically when you advance a reservation to <strong className="text-teal-700">Deposit Paid</strong> or <strong className="text-emerald-700">Confirmed</strong>. Use the action button in each row to move a booking forward, or open the detail view for a manual status override and the option to resend emails.
        </p>
      </div>

      <div className="bg-white border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search guest, email, property…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-teal-mid"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as BookingStatus | 'all')}
              className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-teal-mid bg-white min-w-[160px]"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={propertyFilter}
              onChange={e => setPropertyFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-teal-mid bg-white min-w-[160px]"
            >
              {properties.map(p => <option key={p} value={p}>{p === 'all' ? 'All Properties' : p}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-sans text-sm text-slate-400">No reservations match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Guest', 'Property', 'Dates', 'Nights', 'Total', 'Status', 'Notified', 'Next Action', ''].map((h, i) => (
                    <th key={i} className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const action = STATUS_ACTIONS[r.status];
                  return (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-sans text-sm font-medium text-slate-700 whitespace-nowrap">{guestFullName(r)}</p>
                        <p className="font-sans text-xs text-slate-400">{r.guest_email}</p>
                      </td>
                      <td className="px-4 py-3 font-sans text-sm text-slate-600 whitespace-nowrap">{r.property_name}</td>
                      <td className="px-4 py-3 font-sans text-xs text-slate-500 whitespace-nowrap">
                        {r.check_in} – {r.check_out}
                      </td>
                      <td className="px-4 py-3 font-sans text-sm text-slate-600 text-center">{r.nights}</td>
                      <td className="px-4 py-3 font-sans text-sm font-semibold text-slate-800 whitespace-nowrap">${r.total_amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        {r.notification_email_sent_at ? (
                          <span title={`Sent ${new Date(r.notification_email_sent_at).toLocaleString()}`}>
                            <MailCheck className="w-4 h-4 text-emerald-500" />
                          </span>
                        ) : r.notification_email_error ? (
                          <span title={r.notification_email_error}>
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          </span>
                        ) : (
                          <span title="Not yet sent">
                            <Mail className="w-4 h-4 text-slate-300" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {action ? (
                          <button
                            type="button"
                            disabled={statusUpdating === r.id || (sendingEmail && emailSent !== r.id)}
                            onClick={() => advanceStatus(r)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium transition-colors disabled:opacity-40 whitespace-nowrap ${action.style}`}
                          >
                            {action.sendEmail && <Send className="w-3 h-3 flex-shrink-0" />}
                            {statusUpdating === r.id ? '…' : action.label}
                          </button>
                        ) : r.status === 'fully_paid' ? (
                          <span className="font-sans text-xs text-emerald-600 font-medium">Complete</span>
                        ) : r.status === 'cancelled' ? (
                          <span className="font-sans text-xs text-slate-400">Cancelled</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openDetail(r)}
                          className="p-1.5 text-slate-400 hover:text-teal-deep hover:bg-slate-100 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <AdminModal
          title={guestFullName(selected)}
          subtitle={`Ref: #${selected.id.slice(0, 8).toUpperCase()} · ${selected.property_name}`}
          onClose={() => setSelected(null)}
          size="lg"
          footer={
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-slate-500 uppercase tracking-wide">Status:</span>
                <div className="relative">
                  <select
                    value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value as BookingStatus)}
                    disabled={statusUpdating === selected.id}
                    className="appearance-none pl-3 pr-8 py-2 border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-teal-mid bg-white"
                  >
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {emailSent === selected.id ? (
                  <span className="flex items-center gap-1.5 font-sans text-sm text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> Email sent
                  </span>
                ) : (
                  <>
                    {STATUS_ACTIONS[selected.status] && (
                      <button
                        type="button"
                        onClick={() => advanceStatus(selected)}
                        disabled={sendingEmail || statusUpdating === selected.id}
                        className={`flex items-center gap-1.5 px-4 py-2 font-sans text-sm disabled:opacity-50 transition-colors ${STATUS_ACTIONS[selected.status]!.style}`}
                      >
                        {STATUS_ACTIONS[selected.status]!.sendEmail && <Send className="w-3.5 h-3.5" />}
                        {sendingEmail ? 'Sending…' : STATUS_ACTIONS[selected.status]!.label}
                      </button>
                    )}
                    {(selected.status === 'deposit_paid' || selected.status === 'confirmed') && (
                      <button
                        type="button"
                        onClick={() => sendConfirmation(selected.id)}
                        disabled={sendingEmail}
                        className="flex items-center gap-1.5 px-4 py-2 border border-teal-deep text-teal-deep font-sans text-sm hover:bg-ocean-50 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {sendingEmail ? 'Sending…' : 'Resend Guest Email'}
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => sendOwnerNotification(selected.id)}
                  disabled={sendingOwnerNotif}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-600 font-sans text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <MailCheck className="w-3.5 h-3.5" />
                  {sendingOwnerNotif ? 'Sending…' : 'Send Owner Notification'}
                </button>
                <button type="button" onClick={() => setSelected(null)} className="flex items-center gap-1.5 font-sans text-sm text-slate-500 hover:text-slate-700">
                  <X className="w-4 h-4" /> Close
                </button>
              </div>
            </div>
          }
        >
          {emailError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-600">{emailError}</div>
          )}

          {/* Owner notification status */}
          {ownerNotifResult && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 flex items-start gap-2">
              <MailCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-emerald-700">Owner notification sent</p>
                <p className="font-sans text-xs text-emerald-600 mt-0.5">
                  Delivered to: {ownerNotifResult.to.join(', ')}
                </p>
              </div>
            </div>
          )}
          {ownerNotifError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-red-600">{ownerNotifError}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-sans text-xs uppercase tracking-widest text-slate-400">Guest Info</h4>
                {!editingContact ? (
                  <button
                    type="button"
                    onClick={() => { setContactForm({ email: selected.guest_email ?? '', phone: selected.guest_phone ?? '' }); setEditingContact(true); }}
                    className="flex items-center gap-1 font-sans text-xs text-teal-deep hover:text-teal-mid transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={saveContact}
                      disabled={savingContact}
                      className="flex items-center gap-1 font-sans text-xs text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      <Check className="w-3 h-3" /> {savingContact ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingContact(false)}
                      className="font-sans text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {editingContact ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-sans text-xs text-slate-400 mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                        className="flex-1 border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-teal-mid"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-xs text-slate-400 mb-1">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                        className="flex-1 border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-teal-mid"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${selected.guest_email}`} className="text-teal-deep hover:underline">{selected.guest_email}</a>
                  </div>
                  {selected.guest_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${selected.guest_phone}`} className="text-teal-deep hover:underline">{selected.guest_phone}</a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-3">Stay Details</h4>
              <div className="space-y-1.5 text-sm">
                {([
                  ['Property', selected.property_name],
                  ['Check-in', selected.check_in],
                  ['Check-out', selected.check_out],
                  ['Nights', selected.nights],
                  ['Guests', selected.guests],
                  ...(selected.pet_addon ? [['Pet Add-on', `Yes (+$${selected.pet_fee})`]] : []),
                ] as [string, string | number][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400">{k}</span>
                    <span className="text-slate-700 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-3">Payment</h4>
              <div className="space-y-1.5 text-sm">
                {([
                  ['Subtotal', `$${selected.subtotal.toLocaleString()}`],
                  ['Cleaning Fee', `$${selected.cleaning_fee}`],
                  ['Linen Fee', `$${selected.linen_fee}`],
                  ['Property Fee', `$${selected.property_fee}`],
                  ...(selected.pet_fee ? [['Pet Fee', `$${selected.pet_fee}`]] : []),
                  ['Total', `$${selected.total_amount.toLocaleString()}`],
                  ['Plan', selected.payment_option === 'deposit' ? 'Deposit' : 'Full Pay'],
                  ['Amount Paid', `$${selected.amount_paid.toLocaleString()}`],
                  ['Balance Due', `$${selected.balance_due.toLocaleString()}`],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className={`flex justify-between ${k === 'Total' ? 'font-semibold border-t border-slate-100 pt-1.5 text-base' : ''}`}>
                    <span className="text-slate-400">{k}</span>
                    <span className="text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-3">Status Timeline</h4>
              <div className="space-y-2.5">
                {(['pending', 'deposit_paid', 'confirmed', 'balance_due', 'fully_paid'] as BookingStatus[]).map(s => {
                  const idx = ALL_STATUSES.indexOf(s);
                  const curIdx = ALL_STATUSES.indexOf(selected.status);
                  const isPast = curIdx > idx;
                  const isCurrent = selected.status === s;
                  return (
                    <div key={s} className={`flex items-center gap-2.5 text-xs font-sans ${isCurrent ? 'font-medium' : isPast ? 'opacity-50' : 'opacity-30'}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCurrent ? 'bg-teal-deep ring-2 ring-teal-deep/20' : isPast ? 'bg-slate-400' : 'bg-slate-200'}`} />
                      <StatusBadge status={s} />
                      {(s === 'deposit_paid' || s === 'confirmed') && (
                        <span className="text-slate-400 font-normal italic">email sent</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="font-sans text-xs text-slate-400 mt-3">
                Submitted: {new Date(selected.created_at).toLocaleString()}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1.5">Owner Notification</p>
                {selected.notification_email_sent_at ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <MailCheck className="w-3.5 h-3.5" />
                    Sent {new Date(selected.notification_email_sent_at).toLocaleString()}
                  </div>
                ) : selected.notification_email_error ? (
                  <div className="flex items-start gap-1.5 text-xs text-red-500">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="break-all">{selected.notification_email_error}</span>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-slate-400 italic">Not yet sent</p>
                )}
              </div>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
