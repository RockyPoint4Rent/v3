import type { BookingPricing } from '../../lib/bookingUtils';

type Props = {
  pricing: BookingPricing;
  compact?: boolean;
};

export default function PricingSummary({ pricing, compact = false }: Props) {
  const { nights, breakdown, subtotal, cleaningFee, propertyFee, linenFee, total, depositAmount, dueOnArrival } = pricing;

  const rateGroups = breakdown.reduce<Record<number, number>>((acc, n) => {
    acc[n.rate] = (acc[n.rate] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {Object.entries(rateGroups).map(([rate, count]) => (
        <div key={rate} className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-light">
            ${rate} × {count} night{count > 1 ? 's' : ''}
          </span>
          <span className="text-slate-700 font-medium">${(Number(rate) * count).toLocaleString()}</span>
        </div>
      ))}

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 font-light">Cleaning fee</span>
        <span className="text-slate-700 font-medium">${cleaningFee}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 font-light">Property fee</span>
        <span className="text-slate-700 font-medium">${propertyFee}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 font-light">Linen fee</span>
        <span className="text-slate-700 font-medium">${linenFee}</span>
      </div>

      <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
        <span className="font-sans font-semibold text-teal-deep text-base">Total</span>
        <span className="font-serif text-2xl text-teal-deep">${total.toLocaleString()}</span>
      </div>

      {!compact && (
        <div className="bg-sand-50 border border-sand-200 p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Deposit to reserve</span>
            <span className="text-teal-mid font-semibold">${depositAmount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-light">Due on arrival</span>
            <span className="text-slate-700">${dueOnArrival.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-400 font-light pt-1 leading-relaxed">
            Only ${depositAmount} required to confirm your reservation.
            Pay the remainder when you arrive.
          </p>
        </div>
      )}

      {!compact && (
        <p className="text-xs text-slate-400 text-center font-light">
          {nights} night{nights > 1 ? 's' : ''} · We accept Zelle
        </p>
      )}
    </div>
  );
}
