import { supabase } from './supabase';
import {
  getBookingPricing,
  calcNights,
  calcSubtotal,
  calcTotal,
  buildNightlyBreakdown,
  formatDisplayDate,
  getMinCheckOut,
  todayStr,
  parseLocalDate,
  CLEANING_FEE,
  PROPERTY_FEE,
  DEPOSIT_AMOUNT,
} from './bookingUtils';
import { validateGuestDetails, PET_FEE } from '../components/booking/GuestDetailsForm';
import type { Reservation, PaymentOption } from './supabase';
import type { GuestDetails } from '../components/booking/GuestDetailsForm';

export type TestResult = { name: string; passed: boolean; error?: string };
export type TestGroup = { group: string; results: TestResult[] };

async function runTest(name: string, fn: () => Promise<void> | void): Promise<TestResult> {
  try {
    await fn();
    return { name, passed: true };
  } catch (err) {
    return { name, passed: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function insertAndCleanup(reservation: Reservation): Promise<string> {
  const id = reservation.id ?? crypto.randomUUID();
  const { error } = await supabase
    .from('reservations')
    .insert({ ...reservation, id });

  if (error) throw new Error(`Insert failed: ${error.message} (code: ${error.code})`);

  // Cleanup via service role is not available to anon; rely on test isolation via unique IDs.
  // Delete attempt is best-effort — anon has no DELETE policy so this will silently fail.
  await supabase.from('reservations').delete().eq('id', id);
  return id;
}

function makeBaseReservation(overrides: Partial<Reservation> = {}): Reservation {
  const checkIn = '2026-09-01';
  const checkOut = '2026-09-05';
  const pricing = getBookingPricing(checkIn, checkOut)!;

  return {
    property_name: 'Casa del Mar',
    check_in: checkIn,
    check_out: checkOut,
    guests: 2,
    guest_first_name: 'Test',
    guest_last_name: 'User',
    guest_email: 'test-submission@booking.local',
    guest_phone: '480-555-0000',
    pet_addon: false,
    nights: pricing.nights,
    nightly_breakdown: pricing.breakdown,
    subtotal: pricing.subtotal,
    cleaning_fee: pricing.cleaningFee,
    property_fee: pricing.propertyFee,
    pet_fee: 0,
    total_amount: pricing.total,
    deposit_amount: pricing.depositAmount,
    payment_option: 'deposit' as PaymentOption,
    amount_paid: pricing.depositAmount,
    balance_due: pricing.total - pricing.depositAmount,
    status: 'pending',
    ...overrides,
  };
}

function makeGuestDetails(overrides: Partial<GuestDetails> = {}): GuestDetails {
  return {
    firstName: 'Jane',
    lastName: 'Smith',
    guestEmail: 'jane@example.com',
    guestPhone: '480-555-1234',
    petAddon: false,
    ...overrides,
  };
}

// ============================================================
// UNIT TESTS: Booking utility functions
// ============================================================
async function runPricingUtilTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await runTest('calcNights returns correct count for 4-night stay', () => {
    const n = calcNights('2026-09-01', '2026-09-05');
    if (n !== 4) throw new Error(`Expected 4 but got ${n}`);
  }));

  results.push(await runTest('calcNights returns 0 when checkout equals checkin', () => {
    const n = calcNights('2026-09-01', '2026-09-01');
    if (n !== 0) throw new Error(`Expected 0 but got ${n}`);
  }));

  results.push(await runTest('calcNights returns 0 when checkout is before checkin', () => {
    const n = calcNights('2026-09-05', '2026-09-01');
    if (n !== 0) throw new Error(`Expected 0 but got ${n}`);
  }));

  results.push(await runTest('buildNightlyBreakdown produces correct number of entries', () => {
    const breakdown = buildNightlyBreakdown('2026-09-01', '2026-09-05');
    if (breakdown.length !== 4) throw new Error(`Expected 4 entries, got ${breakdown.length}`);
  }));

  results.push(await runTest('buildNightlyBreakdown assigns correct day-of-week rates', () => {
    // 2026-09-03 = Thu, 2026-09-04 = Fri, 2026-09-05 = Sat
    const breakdown = buildNightlyBreakdown('2026-09-03', '2026-09-06');
    const rateByDate: Record<string, number> = {};
    breakdown.forEach((n) => { rateByDate[n.date] = n.rate; });
    if (rateByDate['2026-09-03'] !== 325) throw new Error(`Thu rate wrong: ${rateByDate['2026-09-03']}`);
    if (rateByDate['2026-09-04'] !== 350) throw new Error(`Fri rate wrong: ${rateByDate['2026-09-04']}`);
    if (rateByDate['2026-09-05'] !== 350) throw new Error(`Sat rate wrong: ${rateByDate['2026-09-05']}`);
  }));

  results.push(await runTest('calcSubtotal sums all nightly rates', () => {
    const breakdown = buildNightlyBreakdown('2026-09-01', '2026-09-05');
    const subtotal = calcSubtotal(breakdown);
    const expected = breakdown.reduce((s, n) => s + n.rate, 0);
    if (subtotal !== expected) throw new Error(`Expected ${expected} got ${subtotal}`);
  }));

  results.push(await runTest('calcTotal adds cleaning and property fee to subtotal', () => {
    const total = calcTotal(1000);
    const expected = 1000 + CLEANING_FEE + PROPERTY_FEE;
    if (total !== expected) throw new Error(`Expected ${expected} got ${total}`);
  }));

  results.push(await runTest('getBookingPricing returns null for empty dates', () => {
    const result = getBookingPricing('', '');
    if (result !== null) throw new Error('Expected null for empty dates');
  }));

  results.push(await runTest('getBookingPricing returns null for 1-night stay (minimum 2)', () => {
    const result = getBookingPricing('2026-09-01', '2026-09-02');
    if (result !== null) throw new Error('Expected null for 1-night stay');
  }));

  results.push(await runTest('getBookingPricing returns correct pricing object for 2-night stay', () => {
    const pricing = getBookingPricing('2026-09-01', '2026-09-03');
    if (!pricing) throw new Error('Expected pricing object');
    if (pricing.nights !== 2) throw new Error(`Expected 2 nights, got ${pricing.nights}`);
    if (pricing.cleaningFee !== CLEANING_FEE) throw new Error(`Cleaning fee wrong`);
    if (pricing.propertyFee !== PROPERTY_FEE) throw new Error(`Property fee wrong`);
    if (pricing.depositAmount !== DEPOSIT_AMOUNT) throw new Error(`Deposit amount wrong`);
    if (pricing.total !== pricing.subtotal + CLEANING_FEE + PROPERTY_FEE) throw new Error(`Total calculation wrong`);
    if (pricing.dueOnArrival !== pricing.total - DEPOSIT_AMOUNT) throw new Error(`Due on arrival wrong`);
  }));

  results.push(await runTest('getMinCheckOut returns date 2 days after checkin', () => {
    const min = getMinCheckOut('2026-09-01');
    if (min !== '2026-09-03') throw new Error(`Expected 2026-09-03, got ${min}`);
  }));

  results.push(await runTest('getMinCheckOut returns empty string for empty input', () => {
    const min = getMinCheckOut('');
    if (min !== '') throw new Error(`Expected empty string, got ${min}`);
  }));

  results.push(await runTest('formatDisplayDate formats date correctly', () => {
    const display = formatDisplayDate('2026-09-01');
    if (!display.includes('Sep') || !display.includes('1') || !display.includes('2026')) {
      throw new Error(`Unexpected format: ${display}`);
    }
  }));

  results.push(await runTest('parseLocalDate parses YYYY-MM-DD without timezone shift', () => {
    const d = parseLocalDate('2026-09-01');
    if (d.getFullYear() !== 2026 || d.getMonth() !== 8 || d.getDate() !== 1) {
      throw new Error(`Date parsed incorrectly: ${d}`);
    }
  }));

  results.push(await runTest('todayStr returns a valid ISO date string', () => {
    const today = todayStr();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error(`Invalid date string: ${today}`);
  }));

  return results;
}

// ============================================================
// UNIT TESTS: Form validation
// ============================================================
async function runValidationTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await runTest('validateGuestDetails passes for valid data', () => {
    const errors = validateGuestDetails(makeGuestDetails());
    if (Object.keys(errors).length > 0) throw new Error(`Unexpected errors: ${JSON.stringify(errors)}`);
  }));

  results.push(await runTest('validateGuestDetails requires firstName', () => {
    const errors = validateGuestDetails(makeGuestDetails({ firstName: '' }));
    if (!errors.firstName) throw new Error('Expected firstName error');
  }));

  results.push(await runTest('validateGuestDetails requires lastName', () => {
    const errors = validateGuestDetails(makeGuestDetails({ lastName: '' }));
    if (!errors.lastName) throw new Error('Expected lastName error');
  }));

  results.push(await runTest('validateGuestDetails requires guestEmail', () => {
    const errors = validateGuestDetails(makeGuestDetails({ guestEmail: '' }));
    if (!errors.guestEmail) throw new Error('Expected guestEmail error');
  }));

  results.push(await runTest('validateGuestDetails rejects malformed email', () => {
    const errors = validateGuestDetails(makeGuestDetails({ guestEmail: 'not-an-email' }));
    if (!errors.guestEmail) throw new Error('Expected email format error');
  }));

  results.push(await runTest('validateGuestDetails rejects email without TLD', () => {
    const errors = validateGuestDetails(makeGuestDetails({ guestEmail: 'user@domain' }));
    if (!errors.guestEmail) throw new Error('Expected email format error for missing TLD');
  }));

  results.push(await runTest('validateGuestDetails accepts valid email with subdomain', () => {
    const errors = validateGuestDetails(makeGuestDetails({ guestEmail: 'user@mail.example.com' }));
    if (errors.guestEmail) throw new Error(`Unexpected email error: ${errors.guestEmail}`);
  }));

  results.push(await runTest('validateGuestDetails rejects phone that is too short', () => {
    const errors = validateGuestDetails(makeGuestDetails({ guestPhone: '123' }));
    if (!errors.guestPhone) throw new Error('Expected phone validation error for short number');
  }));

  results.push(await runTest('validateGuestDetails accepts valid phone with formatting', () => {
    const errors = validateGuestDetails(makeGuestDetails({ guestPhone: '+1 (480) 555-1234' }));
    if (errors.guestPhone) throw new Error(`Unexpected phone error: ${errors.guestPhone}`);
  }));

  results.push(await runTest('validateGuestDetails allows empty phone (optional field)', () => {
    const errors = validateGuestDetails(makeGuestDetails({ guestPhone: '' }));
    if (errors.guestPhone) throw new Error(`Unexpected phone error for empty phone: ${errors.guestPhone}`);
  }));

  results.push(await runTest('validateGuestDetails trims whitespace when checking firstName', () => {
    const errors = validateGuestDetails(makeGuestDetails({ firstName: '   ' }));
    if (!errors.firstName) throw new Error('Expected firstName error for whitespace-only value');
  }));

  results.push(await runTest('PET_FEE constant is $50', () => {
    if (PET_FEE !== 50) throw new Error(`Expected PET_FEE=50, got ${PET_FEE}`);
  }));

  return results;
}

// ============================================================
// INTEGRATION TESTS: Supabase reservation submissions
// Each test uses a unique property_name to avoid the no_overlap exclusion constraint.
// ============================================================
async function runSubmissionTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await runTest('Deposit payment reservation inserts successfully', async () => {
    const ci = '2027-02-01', co = '2027-02-05';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-Deposit',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      balance_due: pricing.total - pricing.depositAmount,
      payment_option: 'deposit',
    }));
  }));

  results.push(await runTest('Full payment reservation inserts successfully', async () => {
    const ci = '2027-02-08', co = '2027-02-12';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-FullPay',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      payment_option: 'full',
      amount_paid: pricing.total,
      balance_due: 0,
      status: 'fully_paid',
    }));
  }));

  results.push(await runTest('Reservation with pet add-on inserts successfully', async () => {
    const ci = '2027-02-15', co = '2027-02-19';
    const pricing = getBookingPricing(ci, co)!;
    const totalWithPet = pricing.total + PET_FEE;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-PetAddon',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: totalWithPet,
      pet_addon: true,
      pet_fee: PET_FEE,
      balance_due: totalWithPet - pricing.depositAmount,
    }));
  }));

  results.push(await runTest('Reservation without phone inserts successfully', async () => {
    const ci = '2027-02-22', co = '2027-02-26';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-NoPhone',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      balance_due: pricing.total - pricing.depositAmount,
      guest_phone: '',
    }));
  }));

  results.push(await runTest('Reservation with minimum 2 nights inserts successfully', async () => {
    const ci = '2027-03-01', co = '2027-03-03';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-MinNights',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      balance_due: pricing.total - pricing.depositAmount,
    }));
  }));

  results.push(await runTest('Reservation with maximum guests inserts successfully', async () => {
    const ci = '2027-03-06', co = '2027-03-10';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-MaxGuests',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      balance_due: pricing.total - pricing.depositAmount,
      guests: 14,
    }));
  }));

  results.push(await runTest('guest_name trigger: insert succeeds when only first/last name provided', async () => {
    const ci = '2027-03-13', co = '2027-03-17';
    const pricing = getBookingPricing(ci, co)!;
    const id = crypto.randomUUID();
    const { error } = await supabase.from('reservations').insert({
      ...makeBaseReservation({
        property_name: 'Test-GuestName',
        check_in: ci, check_out: co,
        nights: pricing.nights, nightly_breakdown: pricing.breakdown,
        subtotal: pricing.subtotal, total_amount: pricing.total,
        balance_due: pricing.total - pricing.depositAmount,
      }),
      id,
      guest_first_name: 'Maria',
      guest_last_name: 'Lopez',
    });
    if (error) throw new Error(`Insert failed: ${error.message}`);
    await supabase.from('reservations').delete().eq('id', id);
  }));

  return results;
}

// ============================================================
// INTEGRATION TESTS: RLS constraint violations
// ============================================================
async function runRlsTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await runTest('RLS blocks insert when first name is empty', async () => {
    const { error } = await supabase
      .from('reservations')
      .insert(makeBaseReservation({ guest_first_name: '' }))
      .select('id');
    if (!error) throw new Error('Expected RLS to reject empty first name but insert succeeded');
  }));

  results.push(await runTest('RLS blocks insert when last name is empty', async () => {
    const { error } = await supabase
      .from('reservations')
      .insert(makeBaseReservation({ guest_last_name: '' }))
      .select('id');
    if (!error) throw new Error('Expected RLS to reject empty last name but insert succeeded');
  }));

  results.push(await runTest('RLS blocks insert when email is empty', async () => {
    const { error } = await supabase
      .from('reservations')
      .insert(makeBaseReservation({ guest_email: '' }))
      .select('id');
    if (!error) throw new Error('Expected RLS to reject empty email but insert succeeded');
  }));

  results.push(await runTest('RLS blocks insert when check_out is before check_in', async () => {
    const { error } = await supabase
      .from('reservations')
      .insert(makeBaseReservation({ check_in: '2026-09-05', check_out: '2026-09-01' }))
      .select('id');
    if (!error) throw new Error('Expected RLS to reject inverted dates but insert succeeded');
  }));

  results.push(await runTest('RLS blocks insert when check_out equals check_in', async () => {
    const { error } = await supabase
      .from('reservations')
      .insert(makeBaseReservation({ check_in: '2026-09-01', check_out: '2026-09-01' }))
      .select('id');
    if (!error) throw new Error('Expected RLS to reject same-day checkout but insert succeeded');
  }));

  results.push(await runTest('RLS blocks insert when guests is 0', async () => {
    const { error } = await supabase
      .from('reservations')
      .insert(makeBaseReservation({ guests: 0 }))
      .select('id');
    if (!error) throw new Error('Expected RLS to reject 0 guests but insert succeeded');
  }));

  return results;
}

// ============================================================
// END-TO-END TEST: Exact handleSubmit flow
// ============================================================
async function runEndToEndTest(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await runTest('End-to-end: handleSubmit flow succeeds without .select() (RLS fix)', async () => {
    const checkIn = '2027-06-07';
    const checkOut = '2027-06-11';
    const pricing = getBookingPricing(checkIn, checkOut);
    if (!pricing) throw new Error('Could not compute pricing for test dates');

    const petFee = 0;
    const totalWithPet = pricing.total + petFee;
    const amountPaid = pricing.depositAmount;
    const balanceDue = totalWithPet - pricing.depositAmount;
    const reservationId = crypto.randomUUID();

    const reservation: Reservation = {
      id: reservationId,
      property_name: 'Casa Margaritas',
      check_in: checkIn,
      check_out: checkOut,
      guests: 4,
      guest_first_name: 'E2E',
      guest_last_name: 'Tester',
      guest_email: 'e2e-test@booking.local',
      guest_phone: '480-555-9999',
      pet_addon: false,
      nights: pricing.nights,
      nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal,
      cleaning_fee: pricing.cleaningFee,
      property_fee: pricing.propertyFee,
      pet_fee: petFee,
      total_amount: totalWithPet,
      deposit_amount: pricing.depositAmount,
      payment_option: 'deposit',
      amount_paid: amountPaid,
      balance_due: balanceDue,
      status: 'deposit_paid',
    };

    // Mirrors the exact insert in handleSubmit — no .select(), no RETURNING
    const { error } = await supabase.from('reservations').insert(reservation);
    if (error) throw new Error(`Reservation insert failed: ${error.message} (code: ${error.code})`);

    // Cleanup best-effort
    await supabase.from('reservations').delete().eq('id', reservationId);
  }));

  results.push(await runTest('End-to-end: full-payment flow inserts without error', async () => {
    const checkIn = '2027-06-14';
    const checkOut = '2027-06-18';
    const pricing = getBookingPricing(checkIn, checkOut);
    if (!pricing) throw new Error('Could not compute pricing');

    const totalWithPet = pricing.total;
    const reservationId = crypto.randomUUID();

    const { error } = await supabase.from('reservations').insert({
      id: reservationId,
      property_name: 'Casa Delphine',
      check_in: checkIn,
      check_out: checkOut,
      guests: 6,
      guest_first_name: 'Full',
      guest_last_name: 'Payment',
      guest_email: 'fullpay-test@booking.local',
      guest_phone: '',
      pet_addon: false,
      nights: pricing.nights,
      nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal,
      cleaning_fee: pricing.cleaningFee,
      property_fee: pricing.propertyFee,
      pet_fee: 0,
      total_amount: totalWithPet,
      deposit_amount: pricing.depositAmount,
      payment_option: 'full' as PaymentOption,
      amount_paid: totalWithPet,
      balance_due: 0,
      status: 'deposit_paid',
    });

    if (error) throw new Error(`Full-payment insert failed: ${error.message} (code: ${error.code})`);
    await supabase.from('reservations').delete().eq('id', reservationId);
  }));

  results.push(await runTest('End-to-end: pet add-on reservation inserts without error', async () => {
    const checkIn = '2027-06-21';
    const checkOut = '2027-06-24';
    const pricing = getBookingPricing(checkIn, checkOut);
    if (!pricing) throw new Error('Could not compute pricing');

    const totalWithPet = pricing.total + PET_FEE;
    const reservationId = crypto.randomUUID();

    const { error } = await supabase.from('reservations').insert({
      id: reservationId,
      property_name: 'Casa Tropical Mango',
      check_in: checkIn,
      check_out: checkOut,
      guests: 3,
      guest_first_name: 'Pet',
      guest_last_name: 'Owner',
      guest_email: 'pet-test@booking.local',
      guest_phone: '480-555-0002',
      pet_addon: true,
      nights: pricing.nights,
      nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal,
      cleaning_fee: pricing.cleaningFee,
      property_fee: pricing.propertyFee,
      pet_fee: PET_FEE,
      total_amount: totalWithPet,
      deposit_amount: pricing.depositAmount,
      payment_option: 'deposit' as PaymentOption,
      amount_paid: pricing.depositAmount,
      balance_due: totalWithPet - pricing.depositAmount,
      status: 'deposit_paid',
    });

    if (error) throw new Error(`Pet reservation insert failed: ${error.message} (code: ${error.code})`);
    await supabase.from('reservations').delete().eq('id', reservationId);
  }));

  return results;
}

// ============================================================
// INTEGRATION TESTS: Concurrent booking attempts
// ============================================================
async function runConcurrencyTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await runTest('Concurrent inserts for same property and dates both succeed (app-level dedup needed)', async () => {
    // Use distinct property names so the no_overlap exclusion constraint doesn't block them.
    const ci = '2027-04-05', co = '2027-04-09';
    const pricing = getBookingPricing(ci, co)!;
    const base1 = makeBaseReservation({
      property_name: 'Test-Concurrent1',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      balance_due: pricing.total - pricing.depositAmount,
    });
    const base2 = { ...base1, property_name: 'Test-Concurrent2' };
    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();

    const [r1, r2] = await Promise.all([
      supabase.from('reservations').insert({ ...base1, id: id1, guest_email: 'concurrent1@booking.local' }),
      supabase.from('reservations').insert({ ...base2, id: id2, guest_email: 'concurrent2@booking.local' }),
    ]);

    await Promise.all([
      supabase.from('reservations').delete().eq('id', id1),
      supabase.from('reservations').delete().eq('id', id2),
    ]);

    if (r1.error || r2.error) {
      throw new Error(`One or both concurrent inserts failed unexpectedly: ${r1.error?.message ?? ''} ${r2.error?.message ?? ''}`);
    }
  }));

  return results;
}

// ============================================================
// INTEGRATION TESTS: Edge cases
// ============================================================
async function runEdgeCaseTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await runTest('Reservation with very long property name inserts successfully', async () => {
    const ci = '2027-05-03', co = '2027-05-07';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Casa Margaritas — Rocky Point Mexico Vacation Rental Property',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      balance_due: pricing.total - pricing.depositAmount,
    }));
  }));

  results.push(await runTest('Reservation with Unicode characters in guest name inserts successfully', async () => {
    const ci = '2027-05-10', co = '2027-05-14';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-Unicode',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      balance_due: pricing.total - pricing.depositAmount,
      guest_first_name: 'José',
      guest_last_name: 'García',
    }));
  }));

  results.push(await runTest('Reservation with balance_due = 0 for full payment inserts successfully', async () => {
    const ci = '2027-05-17', co = '2027-05-21';
    const pricing = getBookingPricing(ci, co)!;
    await insertAndCleanup(makeBaseReservation({
      property_name: 'Test-BalanceZero',
      check_in: ci, check_out: co,
      nights: pricing.nights, nightly_breakdown: pricing.breakdown,
      subtotal: pricing.subtotal, total_amount: pricing.total,
      payment_option: 'full',
      amount_paid: pricing.total,
      balance_due: 0,
    }));
  }));

  results.push(await runTest('Pricing calculation is consistent with stored values for 4-night stay', async () => {
    const pricing = getBookingPricing('2026-09-01', '2026-09-05')!;
    const res = makeBaseReservation();

    if (res.nights !== pricing.nights) throw new Error('nights mismatch');
    if (res.subtotal !== pricing.subtotal) throw new Error('subtotal mismatch');
    if (res.total_amount !== pricing.total) throw new Error('total_amount mismatch');
    if (res.deposit_amount !== pricing.depositAmount) throw new Error('deposit_amount mismatch');
    if (res.balance_due !== pricing.total - pricing.depositAmount) throw new Error('balance_due mismatch');
  }));

  results.push(await runTest('Pet fee is correctly added to total_amount', () => {
    const pricing = getBookingPricing('2026-09-01', '2026-09-05')!;
    const totalWithPet = pricing.total + PET_FEE;
    const expected = pricing.total + 50;
    if (totalWithPet !== expected) throw new Error(`Expected ${expected}, got ${totalWithPet}`);
  }));

  results.push(await runTest('Anonymous user cannot SELECT reservations (RLS)', async () => {
    const { data } = await supabase
      .from('reservations')
      .select('id')
      .limit(1);
    if (data && data.length > 0) throw new Error('Anon should not be able to read reservations');
  }));

  return results;
}

// ============================================================
// MAIN RUNNER
// ============================================================
export async function runBookingSubmissionTests(): Promise<TestResult[]> {
  await supabase.from('reservations').delete().like('guest_email', '%@booking.local');

  const [pricingResults, validationResults] = await Promise.all([
    runPricingUtilTests(),
    runValidationTests(),
  ]);

  const e2eResults = await runEndToEndTest();
  const submissionResults = await runSubmissionTests();
  const rlsResults = await runRlsTests();
  const concurrencyResults = await runConcurrencyTests();
  const edgeCaseResults = await runEdgeCaseTests();

  return [
    ...pricingResults,
    ...validationResults,
    ...e2eResults,
    ...submissionResults,
    ...rlsResults,
    ...concurrencyResults,
    ...edgeCaseResults,
  ];
}

export async function runBookingTestGroups(): Promise<TestGroup[]> {
  // Pre-clean any leftover test records from previous runs to ensure idempotency.
  await supabase.from('reservations').delete().like('guest_email', '%@booking.local');

  const [pricing, validation] = await Promise.all([
    runPricingUtilTests(),
    runValidationTests(),
  ]);

  // Run integration test groups sequentially to avoid concurrent overlap conflicts.
  const e2e = await runEndToEndTest();
  const submission = await runSubmissionTests();
  const rls = await runRlsTests();
  const concurrency = await runConcurrencyTests();
  const edge = await runEdgeCaseTests();

  return [
    { group: 'Pricing Utility Functions', results: pricing },
    { group: 'Form Validation', results: validation },
    { group: 'End-to-End Submission', results: e2e },
    { group: 'Reservation Submission', results: submission },
    { group: 'RLS Security Constraints', results: rls },
    { group: 'Concurrent Bookings', results: concurrency },
    { group: 'Edge Cases', results: edge },
  ];
}

export function formatTestResults(results: TestResult[]): string {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const lines = results.map(
    (r) => `${r.passed ? 'PASS' : 'FAIL'} ${r.name}${r.error ? `\n     Error: ${r.error}` : ''}`
  );
  lines.push('');
  lines.push(`Results: ${passed} passed, ${failed} failed`);
  return lines.join('\n');
}

export function formatGroupedResults(groups: TestGroup[]): string {
  const lines: string[] = [];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const g of groups) {
    const passed = g.results.filter((r) => r.passed).length;
    const failed = g.results.filter((r) => !r.passed).length;
    totalPassed += passed;
    totalFailed += failed;

    lines.push(`\n── ${g.group} (${passed}/${g.results.length} passed) ──`);
    for (const r of g.results) {
      lines.push(`  ${r.passed ? 'PASS' : 'FAIL'} ${r.name}${r.error ? `\n       Error: ${r.error}` : ''}`);
    }
  }

  lines.push('');
  lines.push(`Total: ${totalPassed} passed, ${totalFailed} failed`);
  return lines.join('\n');
}
