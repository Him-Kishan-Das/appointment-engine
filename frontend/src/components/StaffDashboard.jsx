import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Check, 
  X, 
  AlertCircle,
  Building2,
  UserCheck,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function StaffDashboard({ 
  user, 
  tenant, 
  bookings = [], 
  onNewBooking, 
  onUpdateStatus,
  onNavigateToBooking
}) {
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const todayStr = new Date().toISOString().split('T')[0];

  // Doctors on duty
  const doctors = [
    { id: 'all', name: 'All Doctors' },
    { id: 'sarah-connor', name: 'Dr. Sarah Connor (Lead Specialist)', available: true, slotsToday: 8 },
    { id: 'james-wilson', name: 'Dr. James Wilson (Cardiologist)', available: true, slotsToday: 6 },
  ];

  // Today's bookings
  const todaysBookings = bookings.filter((b) => {
    if (!b.startTimeUTC) return false;
    return new Date(b.startTimeUTC).toISOString().split('T')[0] === todayStr;
  });

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.meetingType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const checkedInCount = todaysBookings.filter(b => b.status === 'completed' || b.status === 'confirmed').length;
  const pendingIntake = todaysBookings.filter(b => b.status === 'pending').length;

  const statusStyles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Staff Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold tracking-wide uppercase text-emerald-200">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Front Desk & Clinic Operations Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'Jessica Alba'} 👋
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Clinic Reception Portal for <strong className="text-white">{tenant?.name || 'Apex Health & Wellness'}</strong>. Manage patient flow, doctor schedules, and walk-in registrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToBooking}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Public Booking Page</span>
            </button>
            <button
              onClick={onNewBooking}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Register Walk-in Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Patient Schedule</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{todaysBookings.length} Patients</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Scheduled across clinic doctors</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Confirmed & Ready</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{checkedInCount}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>Intake complete & verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Doctors On Duty</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">2 Practitioners</div>
          <div className="flex items-center gap-1.5 text-xs text-teal-600 mt-2 font-medium">
            <span>Dr. Sarah Connor & Dr. Wilson</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Confirmation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingIntake}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 mt-2 font-medium">
            <span>Requires reception verification</span>
          </div>
        </div>

      </div>

      {/* Practitioners on Duty Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Clinic Practitioners on Duty Today</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            2 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                SC
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. Sarah Connor</div>
                <div className="text-[11px] text-slate-500">Lead Health Practitioner • 09:00 - 17:00</div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              In Clinic
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                JW
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. James Wilson</div>
                <div className="text-[11px] text-slate-500">Cardiology Specialist • 10:00 - 16:00</div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              In Clinic
            </span>
          </div>
        </div>
      </div>

      {/* Reception Queue: Patient Flow Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        
        {/* Table Header & Search */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Patient Queue & Intake Management</h2>
            <p className="text-xs text-slate-500">Check in patients, verify contact info, and track attendance</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient, phone..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1">
              {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Patient Name & Contact</th>
                <th className="py-3 px-4">Appointment Time</th>
                <th className="py-3 px-4">Doctor Assigned</th>
                <th className="py-3 px-4">Consultation Type</th>
                <th className="py-3 px-4">Intake Status</th>
                <th className="py-3 px-4 text-right">Front Desk Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => {
                const start = new Date(b.startTimeUTC);
                const end = new Date(b.endTimeUTC);
                const dateStr = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                return (
                  <tr key={b._id || b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          {b.clientName ? b.clientName[0] : 'P'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{b.clientName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>{b.clientEmail}</span>
                            {b.clientPhone && <span>• {b.clientPhone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{dateStr}</div>
                      <div className="text-[11px] text-slate-500">{timeStr}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800">Dr. Sarah Connor</span>
                      <div className="text-[10px] text-slate-400">Clinic Room 3</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-700">{b.meetingType || 'General Consultation'}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusStyles[b.status] || statusStyles.confirmed}`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status !== 'completed' && (
                          <button
                            onClick={() => onUpdateStatus(b._id || b.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Mark Patient Checked In & Completed"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Check-In</span>
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => onUpdateStatus(b._id || b.id, 'cancelled')}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Cancel / No-Show"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

