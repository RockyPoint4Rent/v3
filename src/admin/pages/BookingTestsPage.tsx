import { useState } from 'react';
import { FlaskConical, CheckCircle2, XCircle, Loader2, Play, ChevronDown, ChevronRight } from 'lucide-react';
import { runBookingTestGroups } from '../../lib/bookingTests';
import type { TestGroup } from '../../lib/bookingTests';

type RunState = 'idle' | 'running' | 'done';

function GroupSection({ group }: { group: TestGroup }) {
  const [open, setOpen] = useState(true);
  const passed = group.results.filter((r) => r.passed).length;
  const failed = group.results.filter((r) => !r.passed).length;

  return (
    <div className="border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          <span className="font-sans text-sm font-medium text-slate-700">{group.group}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-emerald-600">{passed} passed</span>
          {failed > 0 && <span className="font-sans text-xs text-red-600 font-semibold">{failed} failed</span>}
        </div>
      </button>

      {open && (
        <div className="divide-y divide-slate-100">
          {group.results.map((r, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-4 py-2.5 ${r.passed ? 'bg-white' : 'bg-red-50'}`}
            >
              {r.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className={`font-sans text-xs ${r.passed ? 'text-slate-600' : 'text-red-700 font-medium'}`}>
                  {r.name}
                </p>
                {r.error && (
                  <p className="font-mono text-xs text-red-500 mt-1 break-all">{r.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingTestsPage() {
  const [state, setState] = useState<RunState>('idle');
  const [groups, setGroups] = useState<TestGroup[]>([]);

  const run = async () => {
    setState('running');
    setGroups([]);
    const g = await runBookingTestGroups();
    setGroups(g);
    setState('done');
  };

  const totalPassed = groups.reduce((s, g) => s + g.results.filter((r) => r.passed).length, 0);
  const totalFailed = groups.reduce((s, g) => s + g.results.filter((r) => !r.passed).length, 0);
  const totalTests = groups.reduce((s, g) => s + g.results.length, 0);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <FlaskConical className="w-5 h-5 text-teal-deep" />
          <h1 className="font-serif text-2xl text-slate-800">Booking Tests</h1>
        </div>
        <p className="font-sans text-sm text-slate-500 font-light">
          Runs live tests covering pricing utilities, form validation, reservation submission, RLS security,
          concurrent bookings, and edge cases. Test records are inserted then immediately deleted.
        </p>
      </div>

      <button
        type="button"
        onClick={run}
        disabled={state === 'running'}
        className="flex items-center gap-2 bg-teal-deep text-white font-sans text-sm font-medium px-5 py-2.5 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 mb-6"
      >
        {state === 'running' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        {state === 'running' ? 'Running…' : 'Run All Tests'}
      </button>

      {groups.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-sans text-xs text-slate-500">{totalTests} total</span>
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-sans text-slate-700">{totalPassed} passed</span>
            </div>
            {totalFailed > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="font-sans text-red-600 font-medium">{totalFailed} failed</span>
              </div>
            )}
            {totalFailed === 0 && state === 'done' && (
              <span className="font-sans text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                All tests passed
              </span>
            )}
          </div>

          <div className="space-y-3">
            {groups.map((g) => (
              <GroupSection key={g.group} group={g} />
            ))}
          </div>
        </>
      )}

      {state === 'idle' && groups.length === 0 && (
        <div className="border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="font-sans text-sm text-slate-400">Click "Run All Tests" to verify the booking system</p>
          <p className="font-sans text-xs text-slate-300 mt-1">Covers 35+ tests across 6 categories</p>
        </div>
      )}
    </div>
  );
}
