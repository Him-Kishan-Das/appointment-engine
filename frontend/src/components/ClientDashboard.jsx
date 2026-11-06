import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  CalendarCheck, 
  Search, 
  Plus, 
  ChevronRight, 
  Trash2, 
  X,
  ExternalLink,
  ShieldCheck,
  CalendarDays,
  LayoutDashboard,
  FileText,
  Stethoscope,
  HeartPulse,
  Settings,
  LogOut,
  Video,
  MapPin,
  Download,
  Bell,
  Sparkles,
  ArrowRight,
  Menu,
  Activity,
  Pill,
  Clock4,
  Filter
} from 'lucide-react';

export default function ClientDashboard({ 
  bookings = [], 
  onCancelBooking, 
  onNavigateToBooking,
  onNavigateToHost,
  tenant,
  user,
  currentUser,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'appointments' | 'records' | 'care-team' | 'profile'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState('all'); // 'all' | 'upcoming' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Active patient profile info
  const patient = {
    name: currentUser?.name || 'Michael Vance',
    email: currentUser?.email || 'michael.vance@gmail.com',
    phone: currentUser?.phone || '+1 (555) 234-8901',
    dob: 'May 14, 1988',
    bloodGroup: 'O Positive',
    insuranceProvider: 'Blue Cross Shield Prime',
    insuranceId: 'BCS-889104-A'
  };

  // Filter patient's bookings
  const clientBookings = bookings.filter((b) => {
    if (!b.clientEmail) return true;
    return (
      b.clientEmail.toLowerCase() === patient.email.toLowerCase() ||
      b.clientName?.toLowerCase().includes('vance') ||
      b.clientEmail?.toLowerCase().includes('vance')
    );
  });

  // Calculate statistics
  const now = new Date();
  const upcomingBookings = clientBookings.filter(b => {
    const isFuture = new Date(b.startTimeUTC) >= new Date(now.setHours(0,0,0,0));
    return (b.status === 'confirmed' || b.status === 'pending') && isFuture;
  });
  const pastBookings = clientBookings.filter(b => b.status === 'completed' || new Date(b.startTimeUTC) < now);
  const cancelledBookings = clientBookings.filter(b => b.status === 'cancelled');

  // Next upcoming booking
  const sortedUpcoming = [...upcomingBookings].sort((a, b) => new Date(a.startTimeUTC) - new Date(b.startTimeUTC));
  const nextAppointment = sortedUpcoming[0] || null;

  // Filtered appointments for 'appointments' tab
  const displayedAppointments = clientBookings.filter(b => {
    if (appointmentFilter === 'upcoming') {
      return b.status === 'confirmed' || b.status === 'pending';
    }
    if (appointmentFilter === 'completed') {
      return b.status === 'completed';
    }
    if (appointmentFilter === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  }).filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.meetingType?.toLowerCase().includes(q) ||
      b.notes?.toLowerCase().includes(q) ||
      b.clientName?.toLowerCase().includes(q)
    );
  });

  const statusStyles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  // Demo consultation records
  const clinicalRecords = [
    {
      id: 'rec-1',
      date: 'Oct 24, 2026',
      doctor: 'Dr. Sarah Connor',
      department: 'Preventative Cardiology',
      title: 'Bi-Annual Cardiovascular & Metabolic Panel',
      summary: 'Blood pressure reading: 122/80 mmHg. Resting pulse: 64 bpm. Fasting glucose and lipid ratios within optimal targets.',
      prescriptions: [
        { name: 'CoQ10 Ubiquinol 100mg', dosage: '1 capsule daily with morning meal' },
        { name: 'Omega-3 EPA/DHA 1000mg', dosage: '2 softgels in evening' }
      ],
      recommendations: 'Maintain low-sodium Mediterranean diet. Continue 45-minute zone-2 cardiovascular training 3 times per week.',
      nextFollowUp: 'April 2027'
    },
    {
      id: 'rec-2',
      date: 'Aug 12, 2026',
      doctor: 'Dr. James Wilson',
      department: 'Sports Medicine & Orthopedics',
      title: 'Right Knee Joint & Patellar Tracking Evaluation',
      summary: 'Mild patellar tendonitis identified post-marathon training. No structural ligament tear visible on imaging.',
      prescriptions: [
        { name: 'Naproxen 500mg', dosage: 'As needed for flare-ups, max 5 days' }
      ],
      recommendations: 'Eccentric quad loading exercises and kinetic chain stretching recommended. Ice post physical activity.',
      nextFollowUp: 'As needed'
    }
  ];

  // Demo doctors in practice
  const careTeam = [
    {
      id: 'doc-1',
      name: 'Dr. Sarah Connor',
      title: 'Principal Practitioner & Cardiologist',
      specialty: 'Preventative & Lifestyle Medicine',
      experience: '14+ Years Experience',
      rating: '4.98 (124 reviews)',
      availability: 'Available Today',
      avatar: 'SC',
      avatarColor: 'bg-blue-600 text-white'
    },
    {
      id: 'doc-2',
      name: 'Dr. James Wilson',
      title: 'Lead Orthopedic Consultant',
      specialty: 'Sports Injuries & Joint Health',
      experience: '11+ Years Experience',
      rating: '4.95 (98 reviews)',
      availability: 'Next: Tomorrow',
      avatar: 'JW',
      avatarColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'doc-3',
      name: 'Dr. Lisa Ray',
      title: 'Internal Medicine Specialist',
      specialty: 'Endocrinology & Nutrition',
      experience: '9+ Years Experience',
      rating: '4.92 (87 reviews)',
      availability: 'Available Thursday',
      avatar: 'LR',
      avatarColor: 'bg-teal-600 text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ===================== CLIENT SIDEBAR ===================== */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 flex flex-col h-full">
          
          {/* Clinic Brand & Patient Info */}
          <div className="space-y-4 pb-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight block">
                    {tenant?.name || 'Apex Health'}
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                    Patient Portal
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Badge Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm border border-blue-200 shrink-0">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-900 truncate">{patient.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{patient.email}</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Patient
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="my-5 space-y-1.5 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Patient Menu
            </div>

            <button
              onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Dashboard</span>
              {upcomingBookings.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'overview' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  {upcomingBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('appointments'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">My Appointments</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'appointments' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {clientBookings.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('records'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                activeTab === 'records'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Consultation Records</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {clinicalRecords.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('care-team'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                activeTab === 'care-team'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">My Care Team</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {careTeam.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Patient Profile</span>
            </button>

            <div className="pt-4">
              <button
                onClick={onNavigateToBooking}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book Consultation</span>
              </button>
            </div>
          </nav>

          {/* Bottom Logout & Support */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700 block mb-0.5">Need Help?</span>
              <span>Contact front desk at (555) 019-2831</span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Patient Account</span>
              </button>
            )}
          </div>

        </div>
      </aside>

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-900">{tenant?.name || 'Apex Health'}</span>
            </div>
          </div>

          <button
            onClick={onNavigateToBooking}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </header>

        {/* Tab Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto pb-24">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Patient Welcome Hero */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold tracking-wide uppercase text-blue-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Patient Portal • Apex Health & Wellness
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Welcome back, {patient.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                      Review your scheduled clinic consultations, doctor care recommendations, and upcoming clinical milestones.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={onNavigateToBooking}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Book New Appointment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* HIGHLIGHT: Next Upcoming Appointment Banner */}
              {nextAppointment ? (
                <div className="bg-white rounded-3xl border-2 border-blue-500/20 shadow-md p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-bl-2xl">
                    Next Up
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-blue-700 font-extrabold shrink-0">
                        <span className="text-[11px] uppercase font-bold text-blue-500">
                          {new Date(nextAppointment.startTimeUTC).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl leading-none">
                          {new Date(nextAppointment.startTimeUTC).getDate()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">
                            {nextAppointment.meetingType || 'Clinical Health Review'}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusStyles[nextAppointment.status] || statusStyles.confirmed}`}>
                            {nextAppointment.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                          <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            {new Date(nextAppointment.startTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(nextAppointment.endTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {user?.name || 'Dr. Sarah Connor'}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            Suite 400, Apex Health Campus
                          </span>
                        </div>

                        {nextAppointment.notes && (
                          <p className="text-xs text-slate-500 italic mt-1">
                            Note: "{nextAppointment.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => {
                          const start = new Date(nextAppointment.startTimeUTC);
                          const end = new Date(nextAppointment.endTimeUTC);
                          const title = encodeURIComponent(`${nextAppointment.meetingType || 'Appointment'} with ${user?.name || 'Dr. Sarah Connor'}`);
                          const details = encodeURIComponent(`Consultation at ${tenant?.name || 'Apex Health'}.`);
                          const isoStart = start.toISOString().replace(/-|:|\.\d+/g, '');
                          const isoEnd = end.toISOString().replace(/-|:|\.\d+/g, '');
                          window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${isoStart}/${isoEnd}&details=${details}`, '_blank');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Add to Google Calendar</span>
                      </button>

                      <button
                        onClick={() => onCancelBooking(nextAppointment._id || nextAppointment.id)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reschedule / Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <Clock4 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">No Upcoming Appointments</h3>
                      <p className="text-xs text-slate-500">You don't have any appointments scheduled in the coming days.</p>
                    </div>
                  </div>
                  <button
                    onClick={onNavigateToBooking}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    + Book New Visit
                  </button>
                </div>
              )}

              {/* 4 Stat Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{upcomingBookings.length}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Visits scheduled</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{pastBookings.length}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Past consultations</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Records</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{clinicalRecords.length}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Doctor care summaries</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Care Team</span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{careTeam.length}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Doctors on duty</p>
                </div>

              </div>

              {/* Two Column Section: Recent Appointments & Care Team Quick Access */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Appointments (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Recent Appointments</h2>
                      <p className="text-xs text-slate-500">Your latest consultation history</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {clientBookings.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No appointments booked yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {clientBookings.slice(0, 3).map(b => (
                        <div key={b._id || b.id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                              <span className="text-[9px] uppercase text-slate-400">
                                {new Date(b.startTimeUTC).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span>{new Date(b.startTimeUTC).getDate()}</span>
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{b.meetingType || 'Consultation'}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span>{new Date(b.startTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span>•</span>
                                <span>{user?.name || 'Dr. Sarah Connor'}</span>
                              </div>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusStyles[b.status] || statusStyles.confirmed}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Care Team Sidebar Card (1 col) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Your Care Team</h2>
                      <p className="text-xs text-slate-500">Doctors at Apex Health</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('care-team')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {careTeam.map(doc => (
                      <div key={doc.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-9 h-9 rounded-xl ${doc.avatarColor} font-bold text-xs flex items-center justify-center shrink-0`}>
                            {doc.avatar}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{doc.name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{doc.specialty}</p>
                          </div>
                        </div>

                        <button
                          onClick={onNavigateToBooking}
                          className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          Book
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Health Reminder Tip */}
                  <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-3 text-xs text-blue-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-800 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Clinic Reminder</span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      Please bring your government ID and arrive 10 minutes prior to in-person sessions for intake check-in.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MY APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">My Appointments</h1>
                  <p className="text-xs text-slate-500">Manage and track your upcoming and past clinic consultations</p>
                </div>

                <button
                  onClick={onNavigateToBooking}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book New Appointment</span>
                </button>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                {/* Status Badges */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setAppointmentFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      appointmentFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({clientBookings.length})
                  </button>

                  <button
                    onClick={() => setAppointmentFilter('upcoming')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      appointmentFilter === 'upcoming'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Upcoming ({upcomingBookings.length})
                  </button>

                  <button
                    onClick={() => setAppointmentFilter('completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      appointmentFilter === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Completed ({pastBookings.length})
                  </button>

                  <button
                    onClick={() => setAppointmentFilter('cancelled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      appointmentFilter === 'cancelled'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Cancelled ({cancelledBookings.length})
                  </button>
                </div>

                {/* Search */}
                <div className="relative md:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by doctor or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

              </div>

              {/* Appointments List */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
                {displayedAppointments.length === 0 ? (
                  <div className="p-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">No appointments found</div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {searchQuery
                        ? `No bookings match your search query "${searchQuery}".`
                        : `No appointments in this category.`}
                    </p>
                    <button
                      onClick={onNavigateToBooking}
                      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      + Schedule an Appointment
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {displayedAppointments.map((b) => {
                      const start = new Date(b.startTimeUTC);
                      const end = new Date(b.endTimeUTC);
                      const dateStr = start.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                      return (
                        <div key={b._id || b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-blue-700 font-extrabold text-xs shrink-0">
                              <span className="text-[10px] uppercase font-bold text-blue-500">
                                {start.toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-base leading-none">
                                {start.getDate()}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-900">{b.meetingType || 'Clinical Consultation'}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusStyles[b.status] || statusStyles.confirmed}`}>
                                  {b.status}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {dateStr} • {timeStr}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 text-slate-600">
                                  <User className="w-3 h-3 text-slate-400" />
                                  Doctor: {user?.name || 'Dr. Sarah Connor'}
                                </span>
                              </div>

                              {b.notes && (
                                <div className="text-xs text-slate-600 mt-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70 inline-block">
                                  <strong>Reason / Note:</strong> {b.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {b.status !== 'cancelled' && b.status !== 'completed' && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to cancel the appointment on ${dateStr} at ${timeStr}?`)) {
                                    onCancelBooking(b._id || b.id);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                const title = encodeURIComponent(`${b.meetingType || 'Appointment'} with ${user?.name || 'Dr. Sarah Connor'}`);
                                const details = encodeURIComponent(`Consultation with ${user?.name || 'Dr. Sarah Connor'} at ${tenant?.name || 'Apex Health'}.`);
                                const isoStart = start.toISOString().replace(/-|:|\.\d+/g, '');
                                const isoEnd = end.toISOString().replace(/-|:|\.\d+/g, '');
                                window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${isoStart}/${isoEnd}&details=${details}`, '_blank');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Add to Google Calendar"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Calendar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: CONSULTATION RECORDS & CARE NOTES */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Consultation Records & Prescriptions</h1>
                <p className="text-xs text-slate-500">Clinical summaries, post-visit instructions, and ongoing care recommendations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {clinicalRecords.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4 hover:border-blue-300 transition-colors">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                          {rec.department}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 mt-2">{rec.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{rec.doctor}</span>
                          <span>•</span>
                          <span>{rec.date}</span>
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/80">
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-700 border border-slate-200/70 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Clinical Summary</span>
                      <p>{rec.summary}</p>
                    </div>

                    {rec.prescriptions && rec.prescriptions.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Pill className="w-3 h-3 text-indigo-500" />
                          <span>Prescribed Medications</span>
                        </span>
                        <div className="space-y-1">
                          {rec.prescriptions.map((p, idx) => (
                            <div key={idx} className="text-xs bg-indigo-50/50 border border-indigo-100/80 rounded-xl p-2.5 flex items-center justify-between">
                              <span className="font-bold text-indigo-900">{p.name}</span>
                              <span className="text-[11px] text-indigo-700">{p.dosage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Follow-up: <strong className="text-slate-700">{rec.nextFollowUp}</strong></span>
                      <button 
                        onClick={() => alert(`Downloading official clinical record for ${rec.title}...`)}
                        className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: MY CARE TEAM */}
          {activeTab === 'care-team' && (
            <div className="space-y-6">
              
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Clinic Care Team</h1>
                <p className="text-xs text-slate-500">Certified doctors and healthcare practitioners available at {tenant?.name || 'Apex Health'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {careTeam.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${doc.avatarColor} font-extrabold text-sm flex items-center justify-center shadow-md`}>
                          {doc.avatar}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">{doc.name}</h3>
                          <p className="text-xs text-blue-600 font-semibold">{doc.title}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Specialty</span>
                          <span className="font-bold text-slate-800">{doc.specialty}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Experience</span>
                          <span className="font-semibold text-slate-700">{doc.experience}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Rating</span>
                          <span className="font-bold text-amber-600">★ {doc.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {doc.availability}
                      </span>

                      <button
                        onClick={onNavigateToBooking}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>Book Visit</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: PATIENT PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Patient Profile & Health Details</h1>
                <p className="text-xs text-slate-500">Contact information, insurance details, and clinic preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Profile Summary Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-extrabold text-2xl flex items-center justify-center border-2 border-blue-200 shadow-xs">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{patient.name}</h3>
                      <p className="text-xs text-slate-500">{patient.email}</p>
                    </div>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase">
                      Active Clinic Member
                    </span>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Date of Birth</span>
                      <span className="font-semibold text-slate-900">{patient.dob}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Blood Group</span>
                      <span className="font-bold text-red-600">{patient.bloodGroup}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Primary Care</span>
                      <span className="font-semibold text-slate-900">{user?.name || 'Dr. Sarah Connor'}</span>
                    </div>
                  </div>
                </div>

                {/* Insurance & Contact Details (2 cols) */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Contact Info Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900">Contact & Notification Preferences</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          defaultValue={patient.name}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
                        <input
                          type="email"
                          defaultValue={patient.email}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Mobile Phone Number</label>
                        <input
                          type="tel"
                          defaultValue={patient.phone}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Emergency Contact</label>
                        <input
                          type="text"
                          defaultValue="Rachel Vance (Spouse) • +1 (555) 902-1144"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-slate-700 font-medium">Receive automated SMS & Email appointment reminders (24h before)</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                    </div>
                  </div>

                  {/* Insurance Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900">Health Insurance & Billing Coverage</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Insurance Provider</label>
                        <input
                          type="text"
                          defaultValue={patient.insuranceProvider}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Member / Policy ID</label>
                        <input
                          type="text"
                          defaultValue={patient.insuranceId}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}
