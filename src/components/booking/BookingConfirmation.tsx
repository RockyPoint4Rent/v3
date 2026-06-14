import { Calendar, Users, Mail, Phone, Home, ArrowRight } from 'lucide-react';
import { formatDisplayDate } from '../../lib/bookingUtils';
import type { BookingPricing } from '../../lib/bookingUtils';
import type { GuestDetails } from './GuestDetailsForm';
import type { BookingStatus, PaymentOption } from '../../lib/supabase';
import { STATUS_LABELS, STATUS_COLORS } from '../../lib/supabase';

type Props = {
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestDetails: GuestDetails;
  pricing: BookingPricing;
  petFee?: number;
  paymentOption: PaymentOption;
  reservationId?: string;
  onClose: () => void;
};

const TIMELINE: Array<{ status: BookingStatus; label: string; desc: string }> = [
  { status: 'pending',      label: 'Reservation Requested', desc: 'Your request has been submitted' },
  { status: 'deposit_paid', label: 'Payment Sent',          desc: 'Zelle payment confirmed by you' },
  { status: 'confirmed',    label: 'Booking Confirmed',     desc: 'Owner verifies payment & confirms' },
  { status: 'balance_due',  label: 'Balance Due on Arrival', desc: 'Remaining balance paid at check-in' },
  { status: 'fully_paid',   label: 'Fully Paid',            desc: 'Nothing left to pay — enjoy!' },
];

const FULL_TIMELINE: Array<{ status: BookingStatus; label: string; desc: string }> = [
  { status: 'pending',      label: 'Reservation Requested', desc: 'Your request has been submitted' },
  { status: 'deposit_paid', label: 'Payment Sent',          desc: 'Zelle full payment confirmed by you' },
  { status: 'confirmed',    label: 'Booking Confirmed',     desc: 'Owner verifies payment & confirms' },
  { status: 'fully_paid',   label: 'Fully Paid & Ready',    desc: 'Nothing left to pay — enjoy!' },
];

function StatusBadge({ status }: { status: BookingStatus }) {
  const { bg, text, border } = STATUS_COLORS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wide border ${bg} ${text} ${border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${text.replace('text-', 'bg-')}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function BookingConfirmation({
  propertyName,
  checkIn,
  checkOut,
  guests,
  guestDetails,
  pricing,
  petFee = 0,
  paymentOption,
  reservationId,
  onClose,
}: Props) {
  const currentStatus: BookingStatus = 'pending';
  const totalWithPet = pricing.total + petFee;
  const amountPaid = paymentOption === 'deposit' ? pricing.depositAmount : totalWithPet;
  const balanceDue = paymentOption === 'deposit' ? totalWithPet - pricing.depositAmount : 0;
  const timeline = paymentOption === 'deposit' ? TIMELINE : FULL_TIMELINE;

  const currentStatusIndex = timeline.findIndex((t) => t.status === currentStatus);

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-deep mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-teal-deep font-light mb-2">
          You're All Set!
        </h2>
        <p className="font-sans text-slate-500 font-light leading-relaxed max-w-md mx-auto">
          Thank you, <strong className="text-slate-700">{guestDetails.firstName}</strong>!
          Your reservation request is submitted. We'll confirm within 24 hours.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <StatusBadge status={currentStatus} />
          {reservationId && (
            <span className="font-mono text-xs text-slate-400 border border-slate-200 px-2.5 py-1">
              Ref: #{reservationId.slice(0, 8).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white border border-slate-100 divide-y divide-slate-100">
          {[
            { icon: Home,     label: 'Property', value: propertyName },
            { icon: Calendar, label: 'Dates',    value: `${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)}`, sub: `${pricing.nights} nights` },
            { icon: Users,    label: 'Guests',   value: `${guests} Guest${guests > 1 ? 's' : ''}` },
            { icon: Mail,     label: 'Confirmation to', value: guestDetails.guestEmail },
            ...(guestDetails.guestPhone ? [{ icon: Phone, label: 'Phone', value: guestDetails.guestPhone }] : []),
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="px-4 py-3 flex items-start gap-3">
              <Icon className="w-4 h-4 text-sand-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-sans text-xs text-slate-400 uppercase tracking-wide">{label}</p>
                <p className="font-sans text-sm text-slate-700 font-medium truncate">{value}</p>
                {sub && <p className="font-sans text-xs text-slate-400">{sub}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-teal-deep p-5 text-white">
            <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-3">Payment Summary</p>
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-white/70 font-light">Subtotal</span>
                <span>${pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70 font-light">Cleaning fee</span>
                <span>${pricing.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70 font-light">Linen fee</span>
                <span>${pricing.linenFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70 font-light">Property fee</span>
                <span>${pricing.propertyFee}</span>
              </div>
              {petFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/70 font-light">Pet add-on</span>
                  <span>+${petFee}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span className="font-serif text-xl">${totalWithPet.toLocaleString()}</span>
              </div>
            </div>
            <div className="border-t border-white/20 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-white/70 font-light">
                  {paymentOption === 'deposit' ? 'Deposit sent via Zelle' : 'Full payment sent via Zelle'}
                </span>
                <span className="text-sand-300 font-semibold">${amountPaid.toLocaleString()}</span>
              </div>
              {balanceDue > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70 font-light">Due on arrival</span>
                  <span>${balanceDue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 p-4">
            <p className="font-sans text-xs uppercase tracking-wide text-white/40 mb-2">Zelle To</p>
            <p className="font-sans text-base text-white font-medium">+1 (480) 207-0114</p>
            <p className="font-sans text-xs text-white/50">Tomas Nieva</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-4">Booking Status Timeline</p>
        <div className="relative">
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-4">
            {timeline.map((item, i) => {
              const isDone = i <= currentStatusIndex;
              const isActive = i === currentStatusIndex;
              return (
                <div key={item.status} className="relative flex items-start gap-4 pl-9">
                  <div className={`absolute left-0 w-7 h-7 flex items-center justify-center z-10 ${isDone ? 'bg-teal-deep' : 'bg-white border-2 border-slate-200'}`}>
                    {isDone ? (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className={`pb-1 ${isActive ? '' : ''}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-sans text-sm font-semibold ${isDone ? 'text-teal-deep' : 'text-slate-400'}`}>
                        {item.label}
                      </p>
                      {isActive && (
                        <span className="font-sans text-xs bg-teal-deep text-white px-1.5 py-0.5 tracking-wide uppercase">
                          Current
                        </span>
                      )}
                    </div>
                    <p className={`font-sans text-xs font-light ${isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a href="tel:+14802070114" className="btn-primary flex-1 justify-center">
          <Phone className="w-4 h-4" />
          Call to Confirm
        </a>
        <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">
          Done
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
