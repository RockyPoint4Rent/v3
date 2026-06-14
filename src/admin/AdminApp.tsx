import { useState, useEffect } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminSidebar from './components/AdminSidebar';
import DashboardPage from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';
import PropertiesPage from './pages/PropertiesPage';
import RatesFeesPage from './pages/RatesFeesPage';
import BlackoutDatesPage from './pages/BlackoutDatesPage';
import ReviewsPage from './pages/ReviewsPage';
import FaqsPage from './pages/FaqsPage';
import BookingTestsPage from './pages/BookingTestsPage';
import SmsRecipientsPage from './pages/SmsRecipientsPage';
import EmailRecipientsPage from './pages/EmailRecipientsPage';
import type { AdminPage } from './components/AdminSidebar';
import { adminApi } from './lib/adminApi';

export default function AdminApp() {
  const { user, authState, signIn, signOut } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    if (authState !== 'authenticated') return;
    adminApi.reservations.list().then(data => {
      setPendingCount(data.filter(r => r.status === 'pending').length);
    }).catch(() => {});
    adminApi.reviews.list().then(data => {
      setPendingReviews(data.filter(r => !r.is_published).length);
    }).catch(() => {});
  }, [authState]);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-mid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <AdminLogin onSignIn={signIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        current={currentPage}
        onNavigate={setCurrentPage}
        onSignOut={signOut}
        pendingCount={pendingCount}
        pendingReviews={pendingReviews}
        userEmail={user?.email}
      />

      <main className="flex-1 p-6 lg:p-8 overflow-auto min-w-0">
        {currentPage === 'dashboard'    && <DashboardPage />}
        {currentPage === 'reservations' && <ReservationsPage />}
        {currentPage === 'properties'   && <PropertiesPage />}
        {currentPage === 'rates'        && <RatesFeesPage />}
        {currentPage === 'blackout'     && <BlackoutDatesPage />}
        {currentPage === 'reviews'      && <ReviewsPage />}
        {currentPage === 'faqs'         && <FaqsPage />}
        {currentPage === 'sms'          && <SmsRecipientsPage />}
        {currentPage === 'email'        && <EmailRecipientsPage />}
        {currentPage === 'tests'        && <BookingTestsPage />}
      </main>
    </div>
  );
}
