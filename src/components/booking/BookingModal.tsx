import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Calendar, Users, ChevronDown } from 'lucide-react';
import { getBookingPricing, formatDisplayDate, getMinCheckOut, todayStr } from '../../lib/bookingUtils';
import { supabase } from '../../lib/supabase';
import type { Reservation, PaymentOption } from '../../lib/supabase';
import PricingSummary from './PricingSummary';
import GuestDetailsForm, { validateGuestDetails } from './GuestDetailsForm';
import type { GuestDetails } from './GuestDetailsForm';
import PaymentStep from './PaymentStep';
import BookingConfirmation from './BookingConfirmation';

type Step = 'dates' | 'review' | 'details' | 'payment' | 'confirm';

const STEP_FLOW: Step[] = ['dates', 'review', 'details', 'payment', 'confirm'];
const STEP_LABELS: Record<Step, string> = {
  dates: 'Dates',
  review: 'Review',
  details: 'Details',
  payment: 'Payment',
  confirm: 'Confirmed',
};
const VISIBLE_STEPS: Step[] = ['dates', 'review', 'details', 'payment'];

type Props = {
  propertyName: string;
  maxGuests: number;
  onClose: () => void;
};

function SidebarSummary({
  propertyName,
  checkIn,
  checkOut,
  guests,
  pricing,
  paymentOption,
}: {
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  pricing: ReturnType<typeof getBookingPricing>;
  paymentOption: PaymentOption;
}) {
  if (!pricing) return null;
  const amountNow = paymentOption === 'deposit' ? pricing.depositAmount : pricing.total;
  const amountLater = paymentOption === 'deposit' ? pricing.dueOnArrival : 0;

  return (
    <div className="lg:w-64 bg-sand-50 border-t lg:border-t-0 lg:border-l border-slate-100 p-5 flex-shrink-0">
      <p className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-4">Summary</p>
      <div className="space-y-2 mb-4">
        <div className="bg-white border border-slate-100 px-3 py-2.5">
          <p className="font-sans text-xs text-slate-400">Property</p>
          <p className="font-sans text-sm text-slate-700 font-medium">{propertyName}</p>
        </div>
        {checkIn && checkOut && (
          <div className="bg-white border border-slate-100 px-3 py-2.5">
            <p className="font-sans text-xs text-slate-400">Dates</p>
            <p className="font-sans text-xs text-slate-600 font-medium leading-relaxed">
              {formatDisplayDate(checkIn)} –<br />{formatDisplayDate(checkOut)}
            </p>
            <p className="font-sans text-xs text-slate-400">{pricing.nights} nights</p>
          </div>
        )}
        <div className="bg-white border border-slate-100 px-3 py-2.5">
          <p className="font-sans text-xs text-slate-400">Guests</p>
          <p className="font-sans text-sm text-slate-700 font-medium">{guests} Guest{guests > 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Subtotal ({pricing.nights}n)</span>
          <span>${pricing.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Cleaning</span>
          <span>${pricing.cleaningFee}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Property fee</span>
          <span>${pricing.propertyFee}</span>
        </div>
        <div className="flex justify-between font-sans text-sm font-semibold text-teal-deep pt-1 border-t border-slate-200">
          <span>Total</span>
          <span>${pricing.total.toLocaleString()}</span>
        </div>
        <div className="bg-teal-deep p-3 mt-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-white/70">Due now</span>
            <span className="text-sand-300 font-semibold">${amountNow.toLocaleString()}</span>
          </div>
          {amountLater > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-white/70">On arrival</span>
              <span className="text-white">${amountLater.toLocaleString()}</span>
            </div>
          )}
          <p className="font-sans text-xs text-white/50 pt-1 border-t border-white/10 font-light">
            {paymentOption === 'deposit' ? 'Deposit plan' : 'Full payment'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingModal({ propertyName, maxGuests, onClose }: Props) {
  const [step, setStep] = useState<Step>('dates');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showGuests, setShowGuests] = useState(false);
  const [dateError, setDateError] = useState('');

  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    guestEmail: '',
    guestPhone: '',
    petAddon: false,
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({});

  const [paymentOption, setPaymentOption] = useState<PaymentOption>('deposit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [submittedPetFee, setSubmittedPetFee] = useState(0);

  const pricing = getBookingPricing(checkIn, checkOut);
  const stepIndex = STEP_FLOW.indexOf(step);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    setDateError('');
    if (checkOut && checkOut <= val) setCheckOut('');
  };

  const goNext = () => {
    if (step === 'dates') {
      if (!checkIn || !checkOut) { setDateError('Please select both check-in and check-out dates.'); return; }
      if (!pricing || pricing.nights <= 0) { setDateError('Check-out must be after check-in.'); return; }
      setStep('review');
    } else if (step === 'review') {
      setStep('details');
    } else if (step === 'details') {
      const errors = validateGuestDetails(guestDetails);
      if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
      setValidationErrors({});
      setStep('payment');
    }
  };

  const goBack = () => {
    const prev = STEP_FLOW[stepIndex - 1];
    if (prev && prev !== 'confirm') setStep(prev);
  };

  const handleSubmit = async () => {
    if (!pricing) return;
    setIsSubmitting(true);
    setSubmitError('');

    const petFee = guestDetails.petAddon ? 50 : 0;
    const totalWithPet = pricing.total + petFee;
    const amountPaid = paymentOption === 'deposit' ? pricing.depositAmount : totalWithPet;
    const balanceDue = paymentOption === 'deposit' ? totalWithPet - pricing.depositAmount : 0;
    const id = crypto.randomUUID();

    const reservation: Reservation = {
      id,
      property_name: propertyName,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      guest_first_name: guestDetails.firstName.trim(),
      guest_last_name: guestDetails.lastName.trim(),
      guest_email: guestDetails.guestEmail.trim(),
      guest_phone: guestDetails.guestPhone.trim(),
      pet_addon: guestDetails.petAddon,
      pet_fee: petFee,
      nights: pricing.nights,
      nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal,
      cleaning_fee: pricing.cleaningFee,
      property_fee: pricing.propertyFee,
      linen_fee: pricing.linenFee,
      total_amount: totalWithPet,
      deposit_amount: pricing.depositAmount,
      payment_option: paymentOption,
      amount_paid: amountPaid,
      balance_due: balanceDue,
      status: 'pending',
    };

    const { error } = await supabase.from('reservations').insert(reservation);

    if (error) {
      console.error('Reservation insert error:', error);
      setSubmitError(`Booking failed: ${error.message} (${error.code})`);
      setIsSubmitting(false);
      return;
    }

    // SMS and email are sent server-side via DB triggers

    setReservationId(id);
    setSubmittedPetFee(petFee);
    setIsSubmitting(false);
    setStep('confirm');
  };

  const showSidebar = step !== 'dates' && step !== 'confirm' && pricing;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-teal-deep/60 backdrop-blur-sm"
        onClick={step !== 'confirm' ? onClose : undefined}
      />

      <div className="relative z-10 w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-white sm:shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-teal-deep flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl text-white font-light">
              {step === 'confirm' ? "You're All Set!" : 'Reserve Your Stay'}
            </h2>
            <p className="font-sans text-xs text-white/60">{propertyName}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step !== 'confirm' && (
          <div className="flex border-b border-slate-100 bg-white flex-shrink-0">
            {VISIBLE_STEPS.map((s, i) => {
              const sIdx = STEP_FLOW.indexOf(s);
              const isActive = s === step;
              const isDone = stepIndex > sIdx;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!isDone}
                  onClick={() => { if (isDone) setStep(s); }}
                  className={`flex-1 px-2 py-3 flex items-center justify-center gap-2 transition-colors duration-150 ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center text-xs font-bold font-sans flex-shrink-0 ${isDone ? 'bg-teal-deep text-white' : isActive ? 'border-2 border-teal-deep text-teal-deep' : 'border border-slate-300 text-slate-400'}`}>
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span className={`font-sans text-xs uppercase tracking-wide hidden sm:inline ${isActive ? 'text-teal-deep font-semibold' : isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                    {STEP_LABELS[s]}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {step === 'confirm' ? (
            <div className="p-6">
              <BookingConfirmation
                propertyName={propertyName}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                guestDetails={guestDetails}
                pricing={pricing!}
                petFee={submittedPetFee}
                paymentOption={paymentOption}
                reservationId={reservationId}
                onClose={onClose}
              />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row min-h-full">
              <div className="flex-1 p-6">

                {step === 'dates' && (
                  <div>
                    <h3 className="font-serif text-lg text-teal-deep mb-1">Select Your Dates</h3>
                    <p className="font-sans text-sm text-slate-500 font-light mb-5">
                      Choose your check-in and check-out dates.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-1.5">
                          Check-in <span className="text-coral-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input type="date" value={checkIn} min={todayStr()} onChange={(e) => handleCheckInChange(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-teal-mid bg-white appearance-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-1.5">
                          Check-out <span className="text-coral-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input type="date" value={checkOut} min={checkIn ? getMinCheckOut(checkIn) : todayStr()} disabled={!checkIn}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-teal-mid bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-1.5">Guests</label>
                      <div className="relative">
                        <button type="button" onClick={() => setShowGuests(!showGuests)}
                          className="w-full flex items-center justify-between px-3 py-3 border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-teal-mid">
                          <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showGuests ? 'rotate-180' : ''}`} />
                        </button>
                        {showGuests && (
                          <div className="absolute z-20 top-full left-0 right-0 bg-white border border-slate-200 border-t-0 shadow-lg max-h-48 overflow-y-auto">
                            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                              <button key={n} type="button" onClick={() => { setGuests(n); setShowGuests(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-sand-50 transition-colors duration-150 ${n === guests ? 'text-teal-deep font-medium bg-sand-50' : 'text-slate-600'}`}>
                                {n} Guest{n > 1 ? 's' : ''}{n === maxGuests && <span className="text-slate-400 ml-1">(max)</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {dateError && (
                      <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2.5 mb-4">{dateError}</p>
                    )}
                    {pricing && (
                      <div className="p-4 bg-teal-deep/5 border border-teal-mid/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-sans text-sm text-teal-deep font-medium">{pricing.nights} night{pricing.nights > 1 ? 's' : ''} · All fees included</span>
                          <span className="font-serif text-xl text-teal-deep">${pricing.total.toLocaleString()}</span>
                        </div>
                        <p className="font-sans text-xs text-slate-500 font-light">
                          {formatDisplayDate(checkIn)} – {formatDisplayDate(checkOut)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {step === 'review' && pricing && (
                  <div>
                    <h3 className="font-serif text-lg text-teal-deep mb-4">Your Booking Summary</h3>
                    <div className="bg-slate-50 border border-slate-100 p-4 mb-5">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1">Check-in</p>
                          <p className="font-sans text-sm text-slate-700 font-medium">{formatDisplayDate(checkIn)}</p>
                        </div>
                        <div className="border-x border-slate-200">
                          <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1">Nights</p>
                          <p className="font-serif text-xl text-teal-deep">{pricing.nights}</p>
                        </div>
                        <div>
                          <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1">Check-out</p>
                          <p className="font-sans text-sm text-slate-700 font-medium">{formatDisplayDate(checkOut)}</p>
                        </div>
                      </div>
                    </div>
                    <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-3">Nightly Rate Breakdown</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 mb-5">
                      {pricing.breakdown.map((n, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-light">
                            {new Date(n.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-slate-700">${n.rate} / night</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <PricingSummary pricing={pricing} compact />
                    </div>
                  </div>
                )}

                {step === 'details' && (
                  <div>
                    <h3 className="font-serif text-lg text-teal-deep mb-1">Your Details</h3>
                    <p className="font-sans text-sm text-slate-500 font-light mb-5">
                      We'll use this to confirm your reservation and reach out with next steps.
                    </p>
                    <GuestDetailsForm value={guestDetails} onChange={setGuestDetails} errors={validationErrors} />
                  </div>
                )}

                {step === 'payment' && pricing && (
                  <div>
                    <PaymentStep
                      pricing={pricing}
                      paymentOption={paymentOption}
                      onSelect={setPaymentOption}
                      onConfirm={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                    {submitError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 text-sm text-red-600 font-light">
                        {submitError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showSidebar && (
                <SidebarSummary
                  propertyName={propertyName}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  pricing={pricing}
                  paymentOption={paymentOption}
                />
              )}
            </div>
          )}
        </div>

        {step !== 'confirm' && step !== 'payment' && (
          <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
            {step !== 'dates' ? (
              <button type="button" onClick={goBack} className="flex items-center gap-1.5 font-sans text-sm text-slate-500 hover:text-teal-deep transition-colors duration-200">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={goNext}
              disabled={step === 'dates' && !pricing}
              className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 'dates' ? 'Continue to Review' : step === 'review' ? 'Continue to Details' : 'Continue to Payment'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="flex-shrink-0 border-t border-slate-100 px-6 py-3 flex items-center bg-white">
            <button type="button" onClick={goBack} className="flex items-center gap-1.5 font-sans text-sm text-slate-500 hover:text-teal-deep transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
              Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
