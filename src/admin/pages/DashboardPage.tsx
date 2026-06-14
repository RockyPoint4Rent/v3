import { useState, useEffect } from 'react';
import { CalendarCheck, DollarSign, Clock, TrendingUp, Star, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { adminApi } from '../lib/adminApi';
import type { Reservation, BookingStatus } from '../lib/adminApi';
import StatusBadge from '../components/StatusBadge';

function StatCard({ label, value, icon: Icon, sub, color = 'bg-teal-deep' }: {
  label: string; value: string | number; icon: React.ElementType; sub?: string; color?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="font-sans text-xs uppercase tracking-widest text-slate-400">{label}</p>
        <div className={`w-9 h-9 ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="font-serif text-3xl text-slate-800 mb-1">{value}</p>
      {sub && <p className="font-sans text-xs text-slate-500 font-light">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.reservations.list()
      .then(data => { setReservations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = reservations.length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => ['confirmed', 'deposit_paid', 'fully_paid', 'balance_due'].includes(r.status)).length;
  const revenue = reservations.filter(r => r.status !== 'cancelled').reduce((s, r) => s + r.total_amount, 0);
  const recentFive = reservations.slice(0, 5);

  const statusGroups: { status: BookingStatus; count: number; icon: React.ElementType; color: string }[] = [
    { status: 'pending',      count: reservations.filter(r => r.status === 'pending').length,      icon: Clock,         color: 'text-amber-500' },
    { status: 'deposit_paid', count: reservations.filter(r => r.status === 'deposit_paid').length, icon: TrendingUp,    color: 'text-teal-500' },
    { status: 'confirmed',    count: reservations.filter(r => r.status === 'confirmed').length,    icon: CheckCircle,   color: 'text-emerald-500' },
    { status: 'fully_paid',   count: reservations.filter(r => r.status === 'fully_paid').length,   icon: DollarSign,    color: 'text-emerald-600' },
    { status: 'balance_due',  count: reservations.filter(r => r.status === 'balance_due').length,  icon: AlertTriangle, color: 'text-orange-500' },
    { status: 'cancelled',    count: reservations.filter(r => r.status === 'cancelled').length,    icon: XCircle,       color: 'text-red-400' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sans text-xl font-semibold text-slate-800">Dashboard</h1>
        <p className="font-sans text-sm text-slate-500 font-light mt-0.5">Overview of your rental operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Reservations" value={total} icon={CalendarCheck} sub="All time" />
        <StatCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} sub="Exc. cancelled" color="bg-emerald-600" />
        <StatCard label="Pending Action" value={pending} icon={Clock} sub="Needs review" color="bg-amber-500" />
        <StatCard label="Active Bookings" value={confirmed} icon={Star} sub="Deposit paid +" color="bg-coral-500" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statusGroups.map(({ status, count, icon: Icon, color }) => (
          <div key={status} className="bg-white border border-slate-200 p-4 flex items-center gap-3">
            <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
            <div>
              <p className="font-serif text-xl text-slate-800">{count}</p>
              <StatusBadge status={status} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-sans text-sm font-semibold text-slate-700">Recent Reservations</h2>
          <span className="font-sans text-xs text-slate-400">Last 5</span>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentFive.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-sans text-sm text-slate-400">No reservations yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Guest', 'Property', 'Dates', 'Total', 'Status', 'Submitted'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentFive.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-sans text-sm font-medium text-slate-700">
                      {r.guest_first_name} {r.guest_last_name}
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-slate-600">{r.property_name}</td>
                    <td className="px-4 py-3 font-sans text-xs text-slate-500 whitespace-nowrap">
                      {r.check_in} – {r.check_out}
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-slate-700 font-medium">${r.total_amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 font-sans text-xs text-slate-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
