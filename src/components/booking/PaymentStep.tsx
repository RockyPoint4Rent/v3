import { useState } from 'react';
import { Check, Shield, Clock, Zap, Copy, CheckCircle2 } from 'lucide-react';
import type { PaymentOption } from '../../lib/supabase';
import type { BookingPricing } from '../../lib/bookingUtils';

type Props = {
  pricing: BookingPricing;
  paymentOption: PaymentOption;
  onSelect: (option: PaymentOption) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

const ZELLE_NUMBER = '+1 (480) 207-0114';
const ZELLE_NAME = 'Tomas Nieva';

export default function PaymentStep({ pricing, paymentOption, onSelect, onConfirm, isSubmitting }: Props) {
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const amountDue = paymentOption === 'deposit' ? pricing.depositAmount : pricing.total;
  const remainingAfter = paymentOption === 'deposit' ? pricing.dueOnArrival : 0;

  const copyNumber = () => {
    navigator.clipboard.writeText('+14802070114');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h3 className="font-serif text-lg text-teal-deep mb-1">Choose Your Payment</h3>
      <p className="font-sans text-sm text-slate-500 font-light mb-6">
        Select how you'd like to pay and send via Zelle to confirm your reservation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => onSelect('deposit')}
          className={`relative text-left p-5 border-2 transition-all duration-200 group ${
            paymentOption === 'deposit'
              ? 'border-teal-deep bg-teal-deep/5'
              : 'border-slate-200 bg-white hover:border-teal-mid/50'
          }`}
        >
          {paymentOption === 'deposit' && (
            <span className="absolute top-3 right-3 w-5 h-5 bg-teal-deep flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </span>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 flex items-center justify-center ${paymentOption === 'deposit' ? 'bg-teal-deep' : 'bg-slate-100 group-hover:bg-teal-deep/10'} transition-colors`}>
              <Clock className={`w-4 h-4 ${paymentOption === 'deposit' ? 'text-white' : 'text-slate-500'}`} />
            </div>
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-slate-700">
              Reserve with Deposit
            </span>
          </div>
          <div className="font-serif text-3xl text-teal-deep mb-0.5">${pricing.depositAmount}</div>
          <p className="font-sans text-xs text-slate-500 font-light">Due now via Zelle</p>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="font-sans text-xs text-slate-400 font-light">
              + ${remainingAfter.toLocaleString()} balance due on arrival
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-teal-mid" />
            <span className="font-sans text-xs text-teal-mid font-medium">Flexible &amp; low commitment</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('full')}
          className={`relative text-left p-5 border-2 transition-all duration-200 group ${
            paymentOption === 'full'
              ? 'border-teal-deep bg-teal-deep/5'
              : 'border-slate-200 bg-white hover:border-teal-mid/50'
          }`}
        >
          {paymentOption === 'full' && (
            <span className="absolute top-3 right-3 w-5 h-5 bg-teal-deep flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </span>
          )}
          <span className="absolute -top-2.5 left-4 bg-coral-500 text-white font-sans text-xs font-semibold px-2 py-0.5 tracking-wide">
            Fully Secured
          </span>
          <div className="flex items-center gap-2 mb-2 mt-1">
            <div className={`w-8 h-8 flex items-center justify-center ${paymentOption === 'full' ? 'bg-teal-deep' : 'bg-slate-100 group-hover:bg-teal-deep/10'} transition-colors`}>
              <Zap className={`w-4 h-4 ${paymentOption === 'full' ? 'text-white' : 'text-slate-500'}`} />
            </div>
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-slate-700">
              Pay in Full
            </span>
          </div>
          <div className="font-serif text-3xl text-teal-deep mb-0.5">${pricing.total.toLocaleString()}</div>
          <p className="font-sans text-xs text-slate-500 font-light">Complete payment via Zelle</p>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="font-sans text-xs text-slate-400 font-light">
              Nothing due on arrival — you're all set!
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-coral-500" />
            <span className="font-sans text-xs text-coral-500 font-medium">Priority confirmation</span>
          </div>
        </button>
      </div>

      <div className="bg-slate-900 p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-teal-mid flex items-center justify-center flex-shrink-0">
            <span className="font-sans text-xs font-bold text-white">Z</span>
          </div>
          <span className="font-sans text-sm font-semibold text-white">Zelle Payment Instructions</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/5 px-4 py-3 border border-white/10">
            <div>
              <p className="font-sans text-xs text-white/40 uppercase tracking-wide mb-0.5">Send to</p>
              <p className="font-sans text-sm text-white font-medium">{ZELLE_NUMBER}</p>
              <p className="font-sans text-xs text-white/50">{ZELLE_NAME}</p>
            </div>
            <button
              type="button"
              onClick={copyNumber}
              className="flex items-center gap-1.5 text-xs font-sans text-white/60 hover:text-white transition-colors duration-150 border border-white/20 px-3 py-1.5 hover:border-white/40"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-white/5 px-4 py-3 border border-white/10">
            <div>
              <p className="font-sans text-xs text-white/40 uppercase tracking-wide mb-0.5">Amount to send</p>
              <p className="font-serif text-2xl text-sand-300">${amountDue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs text-white/40 uppercase tracking-wide mb-0.5">Plan</p>
              <p className="font-sans text-sm text-white font-medium">
                {paymentOption === 'deposit' ? 'Deposit' : 'Full Payment'}
              </p>
            </div>
          </div>

          <div className="bg-teal-mid/10 border border-teal-mid/30 px-4 py-3">
            <p className="font-sans text-xs text-teal-300 font-light leading-relaxed">
              <strong className="font-semibold">Add a note:</strong> Include your name and check-in date in the Zelle memo so we can match your payment.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-5">
        <img
          src="/image.png"
          alt="Zelle QR code"
          className="w-56 h-auto"
        />
      </div>

      <div className="bg-sand-50 border border-sand-200 p-4 mb-5">
        <h4 className="font-sans text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">
          What happens next?
        </h4>
        <div className="space-y-2">
          {[
            { step: '1', text: `Send $${amountDue.toLocaleString()} via Zelle to the number above` },
            { step: '2', text: 'Click "I\'ve Sent Payment" below to confirm your request' },
            { step: '3', text: 'We\'ll confirm your booking within 24 hours via email or phone' },
            ...(paymentOption === 'deposit'
              ? [{ step: '4', text: `Pay the remaining $${remainingAfter.toLocaleString()} balance when you arrive` }]
              : [{ step: '4', text: 'Arrive and enjoy your stay — fully paid!' }]),
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <span className="w-5 h-5 bg-teal-deep text-white font-sans text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step}
              </span>
              <span className="font-sans text-sm text-slate-600 font-light">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer mb-5">
        <div
          className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-150 cursor-pointer ${acknowledged ? 'bg-teal-deep border-teal-deep' : 'border-slate-300 bg-white hover:border-teal-mid'}`}
          onClick={() => setAcknowledged(!acknowledged)}
        >
          {acknowledged && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="font-sans text-sm text-slate-600 font-light leading-relaxed">
          I understand I need to send ${amountDue.toLocaleString()} via Zelle to confirm my reservation,
          and my booking will be finalized within 24 hours of payment.
        </span>
      </label>

      <button
        type="button"
        onClick={onConfirm}
        disabled={!acknowledged || isSubmitting}
        className="w-full btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting Reservation…
          </span>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            I've Sent Payment — Submit Request
          </>
        )}
      </button>
    </div>
  );
}
