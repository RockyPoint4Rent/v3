import { useState } from 'react';
import { User, Mail, Phone, AlertCircle, PawPrint } from 'lucide-react';

export type GuestDetails = {
  firstName: string;
  lastName: string;
  guestEmail: string;
  guestPhone: string;
  petAddon: boolean;
};

type Errors = Partial<Record<keyof GuestDetails, string>>;

type Props = {
  value: GuestDetails;
  onChange: (val: GuestDetails) => void;
  errors: Errors;
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

type InputRowProps = {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function InputRow({ label, icon: Icon, required, error, children }: InputRowProps) {
  return (
    <div>
      <label className="block font-sans text-xs text-slate-500 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-coral-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        {children}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

export function validateGuestDetails(details: GuestDetails): Errors {
  const errors: Errors = {};
  if (!details.firstName.trim()) errors.firstName = 'First name is required';
  if (!details.lastName.trim()) errors.lastName = 'Last name is required';
  if (!details.guestEmail.trim()) {
    errors.guestEmail = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.guestEmail)) {
    errors.guestEmail = 'Please enter a valid email address';
  }
  if (details.guestPhone && !/^[\d\s\-()+]{7,20}$/.test(details.guestPhone)) {
    errors.guestPhone = 'Please enter a valid phone number';
  }
  return errors;
}

const inputClass =
  'w-full pl-10 pr-3 py-2.5 border text-sm text-slate-700 focus:outline-none focus:border-teal-mid bg-white transition-colors duration-200';
const inputNormal = 'border-slate-200';
const inputError = 'border-red-300 bg-red-50';

export const PET_FEE = 50;

export default function GuestDetailsForm({ value, onChange, errors }: Props) {
  const hasExternalErrors = Object.keys(errors).length > 0;
  const [touched, setTouched] = useState<Partial<Record<keyof GuestDetails, boolean>>>({});

  const set = (field: keyof GuestDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setTouched((t) => ({ ...t, [field]: true }));
    onChange({ ...value, [field]: e.target.value });
  };

  const togglePet = () => {
    onChange({ ...value, petAddon: !value.petAddon });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputRow label="First Name" icon={User} required error={(touched.firstName || hasExternalErrors) ? errors.firstName : undefined}>
          <input
            type="text"
            value={value.firstName}
            onChange={set('firstName')}
            placeholder="Jane"
            aria-invalid={!!(errors.firstName)}
            className={`${inputClass} ${errors.firstName && (touched.firstName || hasExternalErrors) ? inputError : inputNormal}`}
          />
        </InputRow>

        <InputRow label="Last Name" icon={User} required error={(touched.lastName || hasExternalErrors) ? errors.lastName : undefined}>
          <input
            type="text"
            value={value.lastName}
            onChange={set('lastName')}
            placeholder="Smith"
            aria-invalid={!!(errors.lastName)}
            className={`${inputClass} ${errors.lastName && (touched.lastName || hasExternalErrors) ? inputError : inputNormal}`}
          />
        </InputRow>
      </div>

      <InputRow label="Email Address" icon={Mail} required error={(touched.guestEmail || hasExternalErrors) ? errors.guestEmail : undefined}>
        <input
          type="email"
          value={value.guestEmail}
          onChange={set('guestEmail')}
          placeholder="jane@example.com"
          aria-invalid={!!(errors.guestEmail)}
          className={`${inputClass} ${errors.guestEmail && (touched.guestEmail || hasExternalErrors) ? inputError : inputNormal}`}
        />
      </InputRow>

      <InputRow label="Phone Number" icon={Phone} error={(touched.guestPhone || hasExternalErrors) ? errors.guestPhone : undefined}>
        <input
          type="tel"
          value={value.guestPhone}
          onChange={set('guestPhone')}
          placeholder="+1 (480) 555-0100"
          aria-invalid={!!(errors.guestPhone)}
          className={`${inputClass} ${errors.guestPhone && (touched.guestPhone || hasExternalErrors) ? inputError : inputNormal}`}
        />
      </InputRow>

      <div className="pt-1">
        <p className="font-sans text-xs text-slate-500 uppercase tracking-wide mb-2">Add-ons</p>
        <button
          type="button"
          onClick={togglePet}
          className={`w-full flex items-center justify-between px-4 py-4 border transition-all duration-200 ${
            value.petAddon
              ? 'border-teal-mid bg-teal-deep/5'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${value.petAddon ? 'bg-teal-deep' : 'bg-slate-100'}`}>
              <PawPrint className={`w-4 h-4 ${value.petAddon ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <div className="text-left">
              <p className={`font-sans text-sm font-medium ${value.petAddon ? 'text-teal-deep' : 'text-slate-700'}`}>
                Bring a Pet
              </p>
              <p className="font-sans text-xs text-slate-400 font-light">
                Cats & dogs welcome · One-time fee
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`font-sans text-sm font-semibold ${value.petAddon ? 'text-teal-deep' : 'text-slate-500'}`}>
              +${PET_FEE}
            </span>
            <div className={`w-5 h-5 flex items-center justify-center border-2 transition-all duration-200 ${
              value.petAddon ? 'bg-teal-deep border-teal-deep' : 'border-slate-300'
            }`}>
              {value.petAddon && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        </button>
        {value.petAddon && (
          <div className="border border-t-0 border-teal-mid/30 bg-teal-deep/5 px-4 py-2.5">
            <p className="font-sans text-xs text-teal-deep font-light">
              Pet add-on included · $50 added to your total
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
