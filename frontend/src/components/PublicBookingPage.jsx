import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Building2, 
  FileText,
  RotateCcw,
  Check,
  ShieldCheck,
  CalendarCheck,
  CalendarDays,
  ExternalLink
} from 'lucide-react';

export default function PublicBookingPage({ 
  user, 
  tenant, 
  existingBookings = [], 
  onBookingConfirmed,
  onNavigateToDashboard,
  onNavigateToHost,
  currentUser
}) {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to tomorrow or today
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Client Form Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Generate next 14 dates for calendar picker
  const upcomingDays = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0 is Sun, 6 is Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      list.push({
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        dayNum: d.getDate(),
        isAvailable: !isWeekend, // Mon-Fri standard
      });
    }
    return list;
  }, []);

  // Standard working slots generator based on 30m slots + 10m buffer
  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    
    // Check if weekend
    const d = new Date(`${selectedDate}T00:00:00`);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return []; // Host unavailable on weekends
    }

    const possibleSlots = [
      { time: '09:00 AM', start: '09:00', end: '09:30' },
      { time: '09:40 AM', start: '09:40', end: '10:10' },
      { time: '10:20 AM', start: '10:20', end: '10:50' },
      { time: '11:00 AM', start: '11:00', end: '11:30' },
      { time: '11:40 AM', start: '11:40', end: '12:10' },
      { time: '01:30 PM', start: '13:30', end: '14:00' },
      { time: '02:10 PM', start: '14:10', end: '14:40' },
      { time: '02:50 PM', start: '14:50', end: '15:20' },
      { time: '03:30 PM', start: '15:30', end: '16:00' },
      { time: '04:10 PM', start: '16:10', end: '16:40' },
    ];

    // Filter out conflicts with existing bookings on this selected date
    return possibleSlots.map((slot) => {
      const isTaken = existingBookings.some((b) => {
        if (!b.startTimeUTC || b.status === 'cancelled') return false;
        const bDate = new Date(b.startTimeUTC).toISOString().split('T')[0];
        if (bDate !== selectedDate) return false;
        
        const bHours = new Date(b.startTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        return bHours === slot.start;
      });

      return {
        ...slot,
        isTaken,
      };
    });
  }, [selectedDate, existingBookings]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);
    try {
      const startTime = new Date(`${selectedDate}T${selectedSlot.start}:00.000Z`);
      const endTime = new Date(`${selectedDate}T${selectedSlot.end}:00.000Z`);

      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        notes,
        startTimeUTC: startTime.toISOString(),
        endTimeUTC: endTime.toISOString(),
        meetingType: 'Clinical Health Review (30 mins)',
        status: 'confirmed',
        id: `apt-${Date.now()}`,
      };

      await onBookingConfirmed(payload);

      setBookingSuccess({
        id: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
        date: selectedDate,
        time: selectedSlot.time,
        clientName,
        clientEmail,
        startTime,
        endTime,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingSuccess(null);
    setSelectedSlot(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* Standalone Public Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 tracking-tight block">
                  {tenant?.name || 'Apex Health & Wellness'}
                </span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                  Online Appointment Booking
                </span>
              </div>
            </div>

            {/* Role-Aware Navigation Shortcuts */}
            <div className="flex items-center gap-2.5">
              {currentUser?.role === 'client' && (
                <button
                  onClick={onNavigateToDashboard}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Return to Patient Portal</span>
                </button>
              )}

              {(currentUser?.role === 'host' || currentUser?.role === 'staff') && (
                <button
                  onClick={onNavigateToHost}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Return to Practice Workspace ({currentUser.role.toUpperCase()}) →</span>
                </button>
              )}

              {!currentUser && (
                <button
                  onClick={onNavigateToHost}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {bookingSuccess ? (
          /* Confirmation Card */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Appointment Confirmed
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">You're Scheduled!</h1>
              <p className="text-xs text-slate-500">
                A calendar invitation and confirmation receipt has been sent to <strong className="text-slate-800">{bookingSuccess.clientEmail}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-slate-500 font-medium">
                <span>Confirmation Code:</span>
                <span className="font-mono font-bold text-slate-900">{bookingSuccess.id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Practitioner:</span>
                <span className="font-semibold text-slate-900">{user?.name || 'Dr. Sarah Connor'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Clinic / Organization:</span>
                <span className="font-semibold text-slate-900">{tenant?.name || 'Apex Health & Wellness'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Date:</span>
                <span className="font-semibold text-slate-900">{bookingSuccess.date}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Time Window:</span>
                <span className="font-bold text-blue-600">{bookingSuccess.time} (30 mins)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Patient Name:</span>
                <span className="font-semibold text-slate-900">{bookingSuccess.clientName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onNavigateToDashboard}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                <span>View in Client Dashboard</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          /* Main Public Booking Card */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Host Side Panel (Left 4 cols) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 sm:p-8 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="space-y-6">
                
                {/* Tenant Brand */}
                <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wide uppercase">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{tenant?.name || 'Apex Health & Wellness'}</span>
                </div>

                {/* Host avatar and title */}
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border-2 border-white/10">
                    SC
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight">{user?.name || 'Dr. Sarah Connor'}</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Clinical Specialist & Health Consultant</p>
                  </div>
                </div>

                {/* Appointment details */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>30 Minutes Consultation</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Asia/Kolkata (IST • UTC+05:30)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified Host Practitioner</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
                  Select a date and open time slot to reserve your consultation. You will receive an immediate confirmation with calendar invite.
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500">
                Powered by Appointment Engine Multi-Tenant
              </div>
            </div>

            {/* Interactive Date & Slot Booking (Right 8 cols) */}
            <div className="lg:col-span-8 p-6 sm:p-8 space-y-6">
              
              {/* Step 1: Select Date */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Step 1: Choose Date</span>
                  </label>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedDate}
                  </span>
                </div>

                {/* Horizontal Date Picker */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {upcomingDays.map((d) => {
                    const isSelected = selectedDate === d.dateStr;
                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        disabled={!d.isAvailable}
                        onClick={() => {
                          setSelectedDate(d.dateStr);
                          setSelectedSlot(null);
                        }}
                        className={`flex flex-col items-center justify-center p-3 min-w-[70px] rounded-xl border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                            : d.isAvailable
                              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider">{d.dayName}</span>
                        <span className="text-lg font-extrabold">{d.dayNum}</span>
                        <span className="text-[9px] uppercase font-medium">{d.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Slot */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Step 2: Choose Available Time</span>
                  </label>
                  {selectedSlot && (
                    <span className="text-xs font-bold text-blue-600">
                      Selected: {selectedSlot.time}
                    </span>
                  )}
                </div>

                {slotsForDate.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    No slots available on this date. The host is not working on weekends or holidays.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {slotsForDate.map((slot) => {
                      const isSelected = selectedSlot?.start === slot.start;
                      return (
                        <button
                          key={slot.start}
                          type="button"
                          disabled={slot.isTaken}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : slot.isTaken
                                ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                                : 'bg-white hover:bg-blue-50/70 hover:border-blue-300 text-slate-800 border-slate-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{slot.time}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 3: Enter Details (Visible when slot selected) */}
              {selectedSlot && (
                <form onSubmit={handleBookAppointment} className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Step 3: Patient Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. John Miller"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Reason / Notes</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Routine checkup & wellness review"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Confirming Appointment...' : `Confirm Appointment for ${selectedSlot.time}`}</span>
                  </button>
                </form>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} {tenant?.name || 'Apex Health & Wellness'} • Powered by Appointment Engine Multi-Tenant</p>
        </div>
      </footer>

    </div>
  );
}

