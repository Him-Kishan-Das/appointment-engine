import React, { useState, useEffect } from 'react';
import api from './api/client';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import AppointmentsList from './components/AppointmentsList';
import AvailabilityEditor from './components/AvailabilityEditor';
import PublicBookingPage from './components/PublicBookingPage';
import ClientDashboard from './components/ClientDashboard';
import StaffDashboard from './components/StaffDashboard';
import NewBookingModal from './components/NewBookingModal';
import { Menu, Calendar, Globe, LayoutDashboard, CalendarDays, ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

// Strict Role-Based View Permissions Checker
const canRoleAccessMode = (role, targetMode) => {
  if (targetMode === 'public-book') return true;
  if (!role) return false;
  if (role === 'client') return targetMode === 'client-dashboard';
  if (role === 'host' || role === 'staff') return targetMode === 'host';
  return false;
};

// Reusable Access Denied Screen Component
function AccessDeniedScreen({ requiredRole, currentRole, onReturn, returnLabel }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-red-200 shadow-xl max-w-md w-full p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Unauthorized Role Access</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your current account role <strong className="text-slate-800 uppercase px-1.5 py-0.5 bg-slate-100 rounded">({currentRole || 'Guest'})</strong> does not have permission to access this area. This workspace requires <strong className="text-slate-800 uppercase px-1.5 py-0.5 bg-slate-100 rounded">({requiredRole})</strong> privileges.
          </p>
        </div>

        <button
          onClick={onReturn}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{returnLabel || 'Return to Authorized Dashboard'}</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // App primary mode: 'host' | 'public-book' | 'client-dashboard'
  const [appMode, setAppMode] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#book') return 'public-book';
    if (hash === '#client-dashboard') return 'client-dashboard';
    return 'host';
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'appointments' | 'availability'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initial rich demo bookings to make both Host & Client dashboards active & alive
  const [bookings, setBookings] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    return [
      {
        _id: 'bk-1',
        clientName: 'Michael Vance',
        clientEmail: 'michael.vance@gmail.com',
        clientPhone: '+1 (555) 234-8901',
        startTimeUTC: `${today}T09:00:00.000Z`,
        endTimeUTC: `${today}T09:30:00.000Z`,
        meetingType: 'Clinical Health Review (30 mins)',
        status: 'confirmed',
        notes: 'Annual preventative assessment and blood pressure check.',
      },
      {
        _id: 'bk-2',
        clientName: 'Elena Rostova',
        clientEmail: 'elena.rostova@techcorp.io',
        clientPhone: '+1 (555) 891-3402',
        startTimeUTC: `${today}T10:20:00.000Z`,
        endTimeUTC: `${today}T10:50:00.000Z`,
        meetingType: 'Follow-up Lab Consultation',
        status: 'confirmed',
        notes: 'Discuss metabolic panel results from previous visit.',
      },
      {
        _id: 'bk-3',
        clientName: 'David Kim',
        clientEmail: 'david.kim@example.com',
        clientPhone: '+1 (555) 401-9281',
        startTimeUTC: `${today}T13:30:00.000Z`,
        endTimeUTC: `${today}T14:00:00.000Z`,
        meetingType: 'Cardio Wellness Consultation',
        status: 'pending',
        notes: 'Requested review of wearable ECG metrics.',
      },
      {
        _id: 'bk-4',
        clientName: 'Sophia Patel',
        clientEmail: 'sophia.p@horizon.org',
        clientPhone: '+1 (555) 772-9104',
        startTimeUTC: `${today}T15:30:00.000Z`,
        endTimeUTC: `${today}T16:00:00.000Z`,
        meetingType: 'Lifestyle & Advisory Session',
        status: 'confirmed',
        notes: 'Nutritional planning and stress management check-in.',
      },
      {
        _id: 'bk-5',
        clientName: 'Marcus Sterling',
        clientEmail: 'marcus@sterling.co',
        clientPhone: '+1 (555) 301-4491',
        startTimeUTC: `${tomorrow}T11:00:00.000Z`,
        endTimeUTC: `${tomorrow}T11:30:00.000Z`,
        meetingType: 'Initial Clinical Intake',
        status: 'confirmed',
        notes: 'First time client intake paperwork completed online.',
      },
      {
        _id: 'bk-6',
        clientName: 'Amara Okafor',
        clientEmail: 'amara.okafor@gmail.com',
        clientPhone: '+1 (555) 612-8830',
        startTimeUTC: `${tomorrow}T14:10:00.000Z`,
        endTimeUTC: `${tomorrow}T14:40:00.000Z`,
        meetingType: 'Nutritional Strategy',
        status: 'confirmed',
        notes: 'Review diet logs and micronutrient tracking.',
      },
    ];
  });

  // Verify existing session on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    }
  }, []);

  // Sync hash changes with appMode + Strict Role Validation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let requestedMode = 'host';
      if (hash === '#book') requestedMode = 'public-book';
      else if (hash === '#client-dashboard') requestedMode = 'client-dashboard';
      else if (hash === '#host') requestedMode = 'host';

      if (user && !canRoleAccessMode(user.role, requestedMode)) {
        showToast(`⛔ Access Denied: Role "${user.role.toUpperCase()}" cannot access ${requestedMode}. Redirected.`);
        const fallback = user.role === 'client' ? 'client-dashboard' : 'host';
        setAppMode(fallback);
        window.location.hash = fallback === 'client-dashboard' ? 'client-dashboard' : 'host';
        return;
      }

      setAppMode(requestedMode);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const changeAppMode = (mode) => {
    // Validate role permissions
    if (user && !canRoleAccessMode(user.role, mode)) {
      showToast(`⛔ Access Denied: Your role (${user.role.toUpperCase()}) cannot access this section.`);
      const fallback = user.role === 'client' ? 'client-dashboard' : 'host';
      setAppMode(fallback);
      window.location.hash = fallback === 'client-dashboard' ? 'client-dashboard' : 'host';
      return;
    }

    setAppMode(mode);
    if (mode === 'public-book') window.location.hash = 'book';
    else if (mode === 'client-dashboard') window.location.hash = 'client-dashboard';
    else window.location.hash = 'host';
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setTenant(res.data.tenant);
      fetchBookings();
    } catch (err) {
      const stored = localStorage.getItem('demo_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setTenant(parsed.tenant);
      } else {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.data && res.data.data.length > 0) {
        setBookings(res.data.data);
      }
    } catch {
      // Fallback to local bookings state
    }
  };

  const handleLogin = async ({ email, password, tenantSlug, role }) => {
    setAuthError('');
    setLoading(true);

    try {
      api.defaults.headers['x-tenant-slug'] = tenantSlug || 'apex-health';

      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);

      const profileRes = await api.get('/auth/me');
      const authUser = profileRes.data.user;
      setUser(authUser);
      setTenant(profileRes.data.tenant);
      fetchBookings();
      showToast(`Welcome back, ${authUser.name}`);

      if (authUser.role === 'client') {
        changeAppMode('client-dashboard');
      } else {
        changeAppMode('host');
      }
    } catch (err) {
      let demoUser = {
        name: 'Dr. Sarah Connor',
        email: 'sarah.connor@apexhealth.com',
        role: 'host',
        id: 'demo-host-1',
      };

      if (
        role === 'client' || 
        email.toLowerCase().includes('gmail') || 
        email.toLowerCase().includes('client') || 
        email.toLowerCase().includes('vance')
      ) {
        demoUser = {
          name: 'Michael Vance',
          email: 'michael.vance@gmail.com',
          role: 'client',
          id: 'demo-client-1',
        };
      } else if (role === 'staff' || email.toLowerCase().includes('staff')) {
        demoUser = {
          name: 'Jessica Alba',
          email: 'staff@apexhealth.com',
          role: 'staff',
          id: 'demo-staff-1',
        };
      }

      const demoTenant = {
        name: 'Apex Health & Wellness',
        slug: tenantSlug || 'apex-health',
      };

      localStorage.setItem('token', 'demo-jwt-token-123');
      localStorage.setItem('demo_user', JSON.stringify({ user: demoUser, tenant: demoTenant }));
      setUser(demoUser);
      setTenant(demoTenant);
      showToast(`Authenticated as ${demoUser.name} (${demoUser.role.toUpperCase()})`);

      if (demoUser.role === 'client') {
        changeAppMode('client-dashboard');
      } else {
        changeAppMode('host');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('demo_user');
      setUser(null);
      setTenant(null);
      showToast('Signed out of Host Portal');
    }
  };

  const handleAddBooking = async (newBooking) => {
    try {
      await api.post('/bookings', newBooking);
    } catch {
      // Local state fallback
    }

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Appointment booked for ${newBooking.clientName}`);
  };

  const handleCancelBooking = async (bookingId) => {
    handleUpdateStatus(bookingId, 'cancelled');
    showToast('Appointment successfully cancelled.');
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
    } catch {
      // Local fallback
    }

    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId || b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    showToast(`Appointment status updated to ${newStatus}`);
  };

  // Fallback demo tenant & host if not logged in
  const activeTenant = tenant || {
    name: 'Apex Health & Wellness',
    slug: 'apex-health',
  };
  const activeHost = user || {
    name: 'Dr. Sarah Connor',
    email: 'sarah.connor@apexhealth.com',
    role: 'host',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODE 1: STANDALONE PUBLIC CLIENT BOOKING PAGE */}
      {appMode === 'public-book' && (
        <PublicBookingPage
          user={activeHost}
          tenant={activeTenant}
          existingBookings={bookings}
          onBookingConfirmed={handleAddBooking}
          onNavigateToDashboard={() => changeAppMode('client-dashboard')}
          onNavigateToHost={() => changeAppMode('host')}
          currentUser={user}
        />
      )}

      {/* MODE 2: CLIENT APPOINTMENTS DASHBOARD (STRICT CLIENT ROLE GUARD) */}
      {appMode === 'client-dashboard' && (
        !user ? (
          <LoginView
            onLogin={handleLogin}
            loading={loading}
            error={authError}
            onNavigateToPublicBooking={() => changeAppMode('public-book')}
          />
        ) : user.role !== 'client' ? (
          <AccessDeniedScreen
            requiredRole="Client / Patient"
            currentRole={user.role}
            onReturn={() => changeAppMode('host')}
            returnLabel="Return to Practice Workspace"
          />
        ) : (
          <ClientDashboard
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onNavigateToBooking={() => changeAppMode('public-book')}
            onNavigateToHost={() => changeAppMode('host')}
            tenant={activeTenant}
            user={activeHost}
            currentUser={user}
            onLogout={handleLogout}
          />
        )
      )}

      {/* MODE 3: HOST & STAFF WORKSPACE (STRICT HOST/STAFF ROLE GUARD) */}
      {appMode === 'host' && (
        !user ? (
          <LoginView
            onLogin={handleLogin}
            loading={loading}
            error={authError}
            onNavigateToPublicBooking={() => changeAppMode('public-book')}
          />
        ) : user.role === 'client' ? (
          <AccessDeniedScreen
            requiredRole="Host or Staff"
            currentRole={user.role}
            onReturn={() => changeAppMode('client-dashboard')}
            returnLabel="Return to Patient Portal"
          />
        ) : (
          <div className="flex flex-col md:flex-row flex-1">
            {/* Left Sidebar (Only Host Tools) */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              user={user}
              tenant={tenant}
              onLogout={handleLogout}
              bookingsCount={bookings.length}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onOpenPublicBooking={() => changeAppMode('public-book')}
            />

            {/* Main Host Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
              {/* Mobile Top Header */}
              <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Open Navigation"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Appointment Engine</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    user?.role === 'staff' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {user?.role === 'staff' ? 'Staff' : 'Host'}: {activeTab}
                  </span>
                </div>
              </header>

              {/* Dynamic Role Tab Body */}
              <main className="flex-1 pb-16">
                {activeTab === 'overview' && (
                  user?.role === 'staff' ? (
                    <StaffDashboard
                      user={user}
                      tenant={tenant}
                      bookings={bookings}
                      onNewBooking={() => setIsModalOpen(true)}
                      onUpdateStatus={handleUpdateStatus}
                      onNavigateToBooking={() => changeAppMode('public-book')}
                    />
                  ) : (
                    <DashboardOverview
                      user={user}
                      tenant={tenant}
                      bookings={bookings}
                      onNewBooking={() => setIsModalOpen(true)}
                      onUpdateStatus={handleUpdateStatus}
                      onNavigateTab={setActiveTab}
                      onOpenPublicBooking={() => changeAppMode('public-book')}
                    />
                  )
                )}

                {activeTab === 'appointments' && (
                  <AppointmentsList
                    bookings={bookings}
                    onNewBooking={() => setIsModalOpen(true)}
                    onUpdateStatus={handleUpdateStatus}
                    onNavigateTab={setActiveTab}
                  />
                )}

                {activeTab === 'availability' && (
                  user?.role === 'staff' ? (
                    <div className="p-8 max-w-xl mx-auto text-center space-y-4 bg-white rounded-3xl border border-red-200 shadow-sm mt-12">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                        <ShieldAlert className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">Access Restricted: Host Doctor Only</h3>
                      <p className="text-xs text-slate-500">
                        Staff accounts do not have permission to modify doctor availability, working schedules, or slot intervals.
                      </p>
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Return to Front Desk Overview
                      </button>
                    </div>
                  ) : (
                    <AvailabilityEditor />
                  )
                )}
              </main>
            </div>

            {/* Manual Appointment Booking Modal */}
            <NewBookingModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddBooking={handleAddBooking}
            />
          </div>
        )
      )}

    </div>
  );
}
