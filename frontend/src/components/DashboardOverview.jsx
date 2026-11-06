import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
  AlertCircle,
  Phone,
  Mail,
  MoreVertical,
  Check,
  X,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function DashboardOverview({ 
  user, 
  tenant, 
  bookings = [], 
  onNewBooking, 
  onUpdateStatus, 
  onNavigateTab,
  onOpenPublicBooking = () => {}
}) {
  const [copied, setCopied] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Filter today's bookings
  const todaysBookings = bookings.filter((b) => {
    if (!b.startTimeUTC) return false;
    const bDate = new Date(b.startTimeUTC).toISOString().split('T')[0];
    return bDate === todayStr;
  });

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const publicLink = `https://book.engine/${tenant?.slug || 'apex-health'}/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'sarah-connor'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Host Portal: Accepting Patient Bookings
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {user?.name || 'Dr. Sarah Connor'} 👋
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              You have <strong className="text-white font-bold">{todaysBookings.length} appointments</strong> scheduled for today at <strong className="text-white font-bold">{tenant?.name || 'Apex Health'}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('availability')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Configure Working Hours</span>
            </button>
            <button
              onClick={onNewBooking}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 text-blue-700" />
              <span>Add Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Schedule</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{todaysBookings.length}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active schedule for today</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Confirmed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{confirmedCount}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>Across all available dates</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 mt-2 font-medium">
            <span>Successfully attended</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Slot Configuration</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">30 min</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>Buffer: 10 min</span>
            <button 
              onClick={() => onNavigateTab('availability')}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Configure →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Appointments List (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Appointment Schedule</h2>
              <p className="text-xs text-slate-500">Real-time appointments booked for current date</p>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
            >
              View all ({bookings.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todaysBookings.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-800">No appointments scheduled for today</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No client appointments booked for today. You can log a walk-in patient or check your weekly working hours.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={onNewBooking}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    + Add Appointment
                  </button>
                  <button
                    onClick={() => onNavigateTab('availability')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    View Working Hours
                  </button>
                </div>
              </div>
            ) : (
              todaysBookings.map((booking) => {
                const start = new Date(booking.startTimeUTC);
                const end = new Date(booking.endTimeUTC);
                const timeString = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                const statusStyles = {
                  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  pending: 'bg-amber-50 text-amber-700 border-amber-200',
                  cancelled: 'bg-red-50 text-red-700 border-red-200',
                };

                return (
                  <div key={booking._id || booking.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        <span>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{booking.clientName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyles[booking.status] || statusStyles.confirmed}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {timeString}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium">{booking.meetingType || 'Consultation'}</span>
                          {booking.clientEmail && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">{booking.clientEmail}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick status actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => onUpdateStatus(booking._id || booking.id, 'completed')}
                          title="Mark completed"
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => onUpdateStatus(booking._id || booking.id, 'cancelled')}
                          title="Cancel appointment"
                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Host Practice & Share Link */}
        <div className="space-y-6">
          
          {/* Practice & Host Profile card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Host Practice Details</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                SC
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{user?.name || 'Dr. Sarah Connor'}</div>
                <div className="text-xs text-slate-500">{user?.email || 'sarah.connor@apexhealth.com'}</div>
                <div className="text-xs text-blue-600 font-medium mt-0.5">{tenant?.name || 'Apex Health & Wellness'}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tenant Plan:</span>
                <span className="font-semibold text-slate-900 uppercase">Pro Tier</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Host Timezone:</span>
                <span className="font-semibold text-slate-900">Asia/Kolkata (IST)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Working Days:</span>
                <span className="font-semibold text-slate-900">Mon - Fri</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('availability')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Modify Working Hours & Slots
            </button>
          </div>

          {/* Client Booking Share Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-5 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Client Booking URL</span>
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Share this link with patients to allow them to view open slots and book appointments online.
            </p>
            <p className="text-[11px] font-mono text-slate-300 bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 truncate">
              {publicLink.replace('https://', '')}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={onOpenPublicBooking}
                title="Open client view in new tab"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
