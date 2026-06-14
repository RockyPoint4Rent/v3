import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Users, ChevronDown } from 'lucide-react';
import { analytics } from '../lib/analytics';
import { getBookingPricing, formatDisplayDate } from '../lib/bookingUtils';
import { supabase } from '../lib/supabase';
import type { Reservation, PaymentOption } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingSummary from '../components/booking/PricingSummary';
import GuestDetailsForm, { validateGuestDetails, PET_FEE } from '../components/booking/GuestDetailsForm';
import type { GuestDetails } from '../components/booking/GuestDetailsForm';
import PaymentStep from '../components/booking/PaymentStep';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import DateRangePicker from '../components/booking/DateRangePicker';
import { useSeo } from '../lib/useSeo';
import { PAGES } from '../lib/seoConfig';

const PROPERTY_FOLDER: Record<string, string> = {
  'Casa Margaritas': 'casa-margaritas',
  'Casa Tropical Mango': 'casa-tropical-mango',
  'Casa Delphine': 'casa-delphine',
};

type Step = 'dates' | 'details' | 'review' | 'payment' | 'confirm';

const STEP_FLOW: Step[] = ['dates', 'details', 'review', 'payment', 'confirm'];
const STEP_LABELS: Record<Step, string> = {
  dates: 'Dates',
  details: 'Details',
  review: 'Review',
  payment: 'Payment',
  confirm: 'Confirmed',
};
const VISIBLE_STEPS: Step[] = ['dates', 'details', 'review', 'payment'];

type Props = {
  propertyName: string;
  maxGuests: number;
  onClose: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
};

function SidebarSummary({
  propertyName,
  checkIn,
  checkOut,
  guests,
  pricing,
  paymentOption,
  petAddon,
}: {
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  pricing: ReturnType<typeof getBookingPricing>;
  paymentOption: PaymentOption;
  petAddon: boolean;
}) {
  if (!pricing) return null;
  const total = pricing.total + (petAddon ? PET_FEE : 0);
  const amountNow = paymentOption === 'deposit' ? pricing.depositAmount : total;
  const amountLater = paymentOption === 'deposit' ? total - pricing.depositAmount : 0;

  return (
    <div className="lg:w-72 bg-sand-50 border-t lg:border-t-0 lg:border-l border-slate-100 p-6 flex-shrink-0">
      <p className="font-sans text-xs uppercase tracking-widest text-slate-400 mb-4">Booking Summary</p>
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
        <div className="flex justify-between text-xs text-slate-500">
          <span>Linen fee</span>
          <span>${pricing.linenFee}</span>
        </div>
        {petAddon && (
          <div className="flex justify-between text-xs text-teal-deep">
            <span>Pet add-on</span>
            <span>+${PET_FEE}</span>
          </div>
        )}
        <div className="flex justify-between font-sans text-sm font-semibold text-teal-deep pt-1 border-t border-slate-200">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
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

export default function BookingPage({
  propertyName,
  maxGuests,
  onClose,
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2,
}: Props) {
  const bookingMeta = PAGES.booking;
  useSeo({
    title: bookingMeta.title,
    description: bookingMeta.description,
    canonical: '/book',
    noindex: bookingMeta.noindex,
  });

  const [step, setStep] = useState<Step>('dates');
  const [activeImg, setActiveImg] = useState(0);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);

  useEffect(() => {
    const folder = PROPERTY_FOLDER[propertyName];
    if (!folder) return;
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cloudinary-images?folder=${folder}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const urls = (data.images ?? []).map((img: { url: string }) => img.url);
        setPropertyImages(urls);
      })
      .catch(() => {});
  }, [propertyName]);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(Math.min(initialGuests, maxGuests));
  const [showGuests, setShowGuests] = useState(false);
  const [dateError, setDateError] = useState('');
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const availDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-check availability whenever both dates change
  useEffect(() => {
    if (!checkIn || !checkOut) { setAvailability('idle'); return; }
    setAvailability('checking');
    if (availDebounceRef.current) clearTimeout(availDebounceRef.current);
    availDebounceRef.current = setTimeout(async () => {
      const { data } = await supabase.rpc('check_property_availability', {
        p_check_in: checkIn,
        p_check_out: checkOut,
      });
      const row = (data ?? []).find(
        (r: { property_name: string; is_booked: boolean }) => r.property_name === propertyName
      );
      setAvailability(row?.is_booked ? 'unavailable' : 'available');
    }, 300);
    return () => { if (availDebounceRef.current) clearTimeout(availDebounceRef.current); };
  }, [checkIn, checkOut, propertyName]);

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    setDateError('');
    setAvailability('idle');
  };

  const handleCheckOutChange = (val: string) => {
    setCheckOut(val);
    setDateError('');
    setAvailability('idle');
  };

  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    guestEmail: '',
    guestPhone: '',
    petAddon: false,
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({});
  const detailsFormRef = useRef<HTMLDivElement>(null);

  const [paymentOption, setPaymentOption] = useState<PaymentOption>('deposit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [submittedPetFee, setSubmittedPetFee] = useState(0);

  const pricing = getBookingPricing(checkIn, checkOut);
  const stepIndex = STEP_FLOW.indexOf(step);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = () => {
    if (step === 'dates') {
      if (!checkIn || !checkOut) { setDateError('Please select both check-in and check-out dates.'); return; }
      if (!pricing || pricing.nights < 2) { setDateError('A minimum of 2 nights is required.'); return; }
      if (availability === 'checking') { setDateError('Please wait while we check availability.'); return; }
      if (availability === 'unavailable') { setDateError('These dates are already booked. Please choose different dates.'); return; }
      setStep('details');
    } else if (step === 'details') {
      const errors = validateGuestDetails(guestDetails);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setTimeout(() => {
          const container = detailsFormRef.current;
          if (!container) return;
          const firstInvalid = container.querySelector<HTMLInputElement>('input[aria-invalid="true"]');
          const target = firstInvalid ?? container;
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
        return;
      }
      setValidationErrors({});
      analytics.bookingStepCompleted({ property_name: propertyName, step: 'details' });
      setStep('review');
    } else if (step === 'review') {
      analytics.bookingStepCompleted({ property_name: propertyName, step: 'review' });
      setStep('payment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    const prev = STEP_FLOW[stepIndex - 1];
    if (prev && prev !== 'confirm') setStep(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!pricing) return;
    setIsSubmitting(true);
    setSubmitError('');

    const petFee = guestDetails.petAddon ? PET_FEE : 0;
    const totalWithPet = pricing.total + petFee;
    const amountPaid = paymentOption === 'deposit' ? pricing.depositAmount : totalWithPet;
    const balanceDue = paymentOption === 'deposit' ? totalWithPet - pricing.depositAmount : 0;
    const reservationId = crypto.randomUUID();

    const reservation: Reservation = {
      id: reservationId,
      property_name: propertyName,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      guest_first_name: guestDetails.firstName.trim(),
      guest_last_name: guestDetails.lastName.trim(),
      guest_email: guestDetails.guestEmail.trim(),
      guest_phone: guestDetails.guestPhone.trim(),
      pet_addon: guestDetails.petAddon,
      nights: pricing.nights,
      nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal,
      cleaning_fee: pricing.cleaningFee,
      property_fee: pricing.propertyFee,
      linen_fee: pricing.linenFee,
      pet_fee: petFee,
      total_amount: totalWithPet,
      deposit_amount: pricing.depositAmount,
      payment_option: paymentOption,
      amount_paid: amountPaid,
      balance_due: balanceDue,
      status: 'pending',
    };

    const { error } = await supabase
      .from('reservations')
      .insert(reservation);

    if (error) {
      console.error('Reservation insert error:', error);
      setSubmitError(`Booking failed: ${error.message} (${error.code})`);
      setIsSubmitting(false);
      return;
    }

    setReservationId(reservationId);
    setSubmittedPetFee(petFee);
    setIsSubmitting(false);
    analytics.bookingSubmitted({ property_name: propertyName, nights: pricing.nights });
    setStep('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showSidebar = (step === 'details' || step === 'review' || step === 'payment') && pricing;

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <Navbar solid />

      <div className="flex-1 pt-20">
        <div className="bg-teal-deep px-6 py-10 lg:py-14">
          <div className="max-w-4xl mx-auto">
            <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-2">
              {step === 'confirm' ? 'Reservation Confirmed' : 'Reserve Your Stay'}
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl text-white font-light mb-1">
              {step === 'confirm' ? "You're All Set!" : propertyName}
            </h1>
            {step !== 'confirm' && (
              <p className="font-sans text-sm text-white/60">
                Rocky Point, Mexico &nbsp;·&nbsp; Up to {maxGuests} guests
              </p>
            )}
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 bg-white text-teal-deep font-sans text-sm font-medium px-4 py-2 hover:bg-white/90 transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Properties
              </button>
            </div>
          </div>
        </div>

        {/* Photo gallery strip */}
        {step !== 'confirm' && (() => {
          const imgs = propertyImages.slice(0, 5);
          if (imgs.length === 0) return null;
          return (
            <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-6">
              <div className="flex gap-2 h-44 lg:h-56">
                {/* Main large photo */}
                <button
                  className="relative flex-[2] overflow-hidden group"
                  onClick={() => setActiveImg(0)}
                >
                  <img
                    src={imgs[activeImg]}
                    alt={propertyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                </button>
                {/* Thumbnail strip */}
                <div className="flex flex-col gap-2 flex-1">
                  {imgs.slice(1, 4).map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i + 1)}
                      className={`relative flex-1 overflow-hidden group transition-all duration-200 ${activeImg === i + 1 ? 'ring-2 ring-teal-mid ring-offset-1' : ''}`}
                    >
                      <img
                        src={src}
                        alt={`${propertyName} photo ${i + 2}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {i === 2 && imgs.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="font-sans text-white text-sm font-medium">+{imgs.length - 4} more</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
          {step !== 'confirm' && (
            <div className="bg-white border border-slate-100 shadow-sm mb-6">
              <div className="flex border-b border-slate-100">
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
                      className={`flex-1 px-2 py-4 flex items-center justify-center gap-2 transition-colors duration-150 border-b-2 ${
                        isActive ? 'border-teal-deep' : isDone ? 'border-transparent cursor-pointer' : 'border-transparent cursor-default'
                      }`}
                    >
                      <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold font-sans flex-shrink-0 ${
                        isDone ? 'bg-teal-deep text-white' : isActive ? 'border-2 border-teal-deep text-teal-deep' : 'border border-slate-300 text-slate-400'
                      }`}>
                        {isDone ? '✓' : i + 1}
                      </span>
                      <span className={`font-sans text-xs uppercase tracking-wide hidden sm:inline ${
                        isActive ? 'text-teal-deep font-semibold' : isDone ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {STEP_LABELS[s]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
            {step === 'confirm' ? (
              <div className="p-6 lg:p-10">
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
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 lg:p-10">

                  {step === 'dates' && (
                    <div>
                      <h2 className="font-serif text-2xl text-teal-deep mb-1 font-light">Select Your Dates</h2>
                      <p className="font-sans text-sm text-slate-500 font-light mb-4">
                        Choose your check-in and check-out dates for {propertyName}.
                        <span className="block mt-1 font-sans text-xs text-red-500 font-medium">Note: There is a 2-night minimum</span>
                      </p>
                      <div className="mb-5">
                        <DateRangePicker
                          propertyName={propertyName}
                          checkIn={checkIn}
                          checkOut={checkOut}
                          onCheckInChange={handleCheckInChange}
                          onCheckOutChange={handleCheckOutChange}
                          minNights={2}
                        />
                      </div>

                      {/* Availability feedback */}
                      {availability === 'checking' && (
                        <div className="flex items-center gap-2 mb-5 py-1">
                          <div className="w-3.5 h-3.5 border-2 border-teal-deep border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          <span className="font-sans text-xs text-slate-400">Checking availability…</span>
                        </div>
                      )}
                      {availability === 'unavailable' && (
                        <div className="bg-red-50 border border-red-200 px-3 py-2.5 mb-5">
                          <p className="font-sans text-sm font-medium text-red-700">Not available for these dates</p>
                          <p className="font-sans text-xs text-red-500 mt-0.5">These dates are already booked. Please select different dates.</p>
                        </div>
                      )}
                      {availability === 'available' && checkIn && checkOut && (
                        <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 mb-5">
                          <p className="font-sans text-sm font-medium text-emerald-700">Available — dates look great!</p>
                        </div>
                      )}

                      <div className="mb-5">
                        <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-2">Guests</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowGuests(!showGuests)}
                            className="w-full flex items-center justify-between px-3 py-3.5 border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-teal-mid"
                          >
                            <div className="flex items-center gap-2.5">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showGuests ? 'rotate-180' : ''}`} />
                          </button>
                          {showGuests && (
                            <div className="absolute z-20 top-full left-0 right-0 bg-white border border-slate-200 border-t-0 shadow-lg max-h-48 overflow-y-auto">
                              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => { setGuests(n); setShowGuests(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-sand-50 transition-colors duration-150 ${n === guests ? 'text-teal-deep font-medium bg-sand-50' : 'text-slate-600'}`}
                                >
                                  {n} Guest{n > 1 ? 's' : ''}{n === maxGuests && <span className="text-slate-400 ml-1">(max)</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {dateError && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2.5 mb-5">{dateError}</p>
                      )}
                      {pricing && (
                        <div className="p-5 bg-teal-deep/5 border border-teal-mid/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-sans text-sm text-teal-deep font-medium">{pricing.nights} night{pricing.nights > 1 ? 's' : ''} · All fees included</span>
                            <span className="font-serif text-2xl text-teal-deep">${pricing.total.toLocaleString()}</span>
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
                      <h2 className="font-serif text-2xl text-teal-deep mb-1 font-light">Review Your Booking</h2>
                      <p className="font-sans text-sm text-slate-500 font-light mb-7">
                        Review your Rocky Point rental details before submitting. Almost done!
                      </p>
                      <div className="bg-slate-50 border border-slate-100 p-5 mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1">Check-in</p>
                            <p className="font-sans text-sm text-slate-700 font-medium">{formatDisplayDate(checkIn)}</p>
                          </div>
                          <div className="border-x border-slate-200">
                            <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1">Nights</p>
                            <p className="font-serif text-2xl text-teal-deep">{pricing.nights}</p>
                          </div>
                          <div>
                            <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-1">Check-out</p>
                            <p className="font-sans text-sm text-slate-700 font-medium">{formatDisplayDate(checkOut)}</p>
                          </div>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-3">Nightly Rate Breakdown</p>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 mb-6">
                        {pricing.breakdown.map((n, i) => (
                          <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                            <span className="text-slate-500 font-light">
                              {new Date(n.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-slate-700">${n.rate} / night</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 pt-5">
                        <PricingSummary pricing={pricing} compact />
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="font-sans text-xs text-slate-400 uppercase tracking-wide mb-4">Who's Checking In</p>
                        <div className="bg-slate-50 border border-slate-100 divide-y divide-slate-100">
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="font-sans text-xs text-slate-400 uppercase tracking-wide">Name</span>
                            <span className="font-sans text-sm text-slate-700">{guestDetails.firstName} {guestDetails.lastName}</span>
                          </div>
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="font-sans text-xs text-slate-400 uppercase tracking-wide">Email</span>
                            <span className="font-sans text-sm text-slate-700">{guestDetails.guestEmail}</span>
                          </div>
                          {guestDetails.guestPhone && (
                            <div className="flex items-center justify-between px-4 py-3">
                              <span className="font-sans text-xs text-slate-400 uppercase tracking-wide">Phone</span>
                              <span className="font-sans text-sm text-slate-700">{guestDetails.guestPhone}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="font-sans text-xs text-slate-400 uppercase tracking-wide">Pet Add-on</span>
                            <span className={`font-sans text-sm font-medium ${guestDetails.petAddon ? 'text-teal-deep' : 'text-slate-400'}`}>
                              {guestDetails.petAddon ? 'Yes · +$50' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 'details' && (
                    <div ref={detailsFormRef}>
                      <h2 className="font-serif text-2xl text-teal-deep mb-1 font-light">Your Details</h2>
                      <p className="font-sans text-sm text-slate-500 font-light mb-7">
                        We'll use this to confirm your reservation and reach out with next steps.
                      </p>
                      <GuestDetailsForm value={guestDetails} onChange={setGuestDetails} errors={validationErrors} />
                    </div>
                  )}

                  {step === 'payment' && pricing && (
                    <div>
                      <h2 className="font-serif text-2xl text-teal-deep mb-1 font-light">Payment</h2>
                      <p className="font-sans text-sm text-slate-500 font-light mb-7">
                        Choose your payment option to complete the reservation.
                      </p>
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
                    petAddon={guestDetails.petAddon}
                  />
                )}
              </div>
            )}

            {step !== 'confirm' && step !== 'payment' && (
              <div className="border-t border-slate-100 px-6 lg:px-10 py-5 flex items-center justify-between bg-sand-50">
                {step !== 'dates' ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 font-sans text-sm text-slate-500 hover:text-teal-deep transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={step === 'dates' && (!pricing || availability === 'unavailable' || availability === 'checking')}
                  className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === 'dates' ? 'Continue to Details' : step === 'details' ? 'Continue to Review' : 'Continue to Payment'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="border-t border-slate-100 px-6 lg:px-10 py-4 flex items-center bg-sand-50">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 font-sans text-sm text-slate-500 hover:text-teal-deep transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
