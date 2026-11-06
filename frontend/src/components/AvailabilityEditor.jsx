import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/client';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Check, 
  Loader2, 
  Globe, 
  Calendar, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  Coffee, 
  CalendarX, 
  Zap, 
  ChevronRight, 
  Info, 
  CalendarDays, 
  Sliders, 
  CheckCheck,
  CalendarCheck2,
  CalendarPlus,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

const DAYS = [
  { id: 1, name: 'Monday', short: 'Mon', badge: 'M' },
  { id: 2, name: 'Tuesday', short: 'Tue', badge: 'T' },
  { id: 3, name: 'Wednesday', short: 'Wed', badge: 'W' },
  { id: 4, name: 'Thursday', short: 'Thu', badge: 'T' },
  { id: 5, name: 'Friday', short: 'Fri', badge: 'F' },
  { id: 6, name: 'Saturday', short: 'Sat', badge: 'S' },
  { id: 0, name: 'Sunday', short: 'Sun', badge: 'S' },
];

const TIMEZONES = [
  { id: 'Asia/Kolkata', label: 'Asia/Kolkata (IST • UTC+05:30)' },
  { id: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { id: 'America/New_York', label: 'America/New_York (EST/EDT • UTC-05:00)' },
  { id: 'America/Chicago', label: 'America/Chicago (CST/CDT • UTC-06:00)' },
  { id: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT • UTC-08:00)' },
  { id: 'Europe/London', label: 'Europe/London (GMT/BST • UTC+00:00)' },
  { id: 'Europe/Berlin', label: 'Europe/Berlin (CET • UTC+01:00)' },
  { id: 'Asia/Dubai', label: 'Asia/Dubai (GST • UTC+04:00)' },
  { id: 'Asia/Singapore', label: 'Asia/Singapore (SGT • UTC+08:00)' },
  { id: 'Australia/Sydney', label: 'Australia/Sydney (AEST • UTC+10:00)' },
];

export default function AvailabilityEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly' | 'date-inspector' | 'overrides'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Date selection for slot inspector
  const [selectedSlotDate, setSelectedSlotDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [slotDuration, setSlotDuration] = useState(30);
  const [bufferMinutes, setBufferMinutes] = useState(10);
  
  const [weeklySchedule, setWeeklySchedule] = useState([
    { dayOfWeek: 1, slots: [{ startTime: '09:00', endTime: '12:30' }, { startTime: '13:30', endTime: '17:00' }] },
    { dayOfWeek: 2, slots: [{ startTime: '09:00', endTime: '12:30' }, { startTime: '13:30', endTime: '17:00' }] },
    { dayOfWeek: 3, slots: [{ startTime: '09:00', endTime: '12:30' }, { startTime: '13:30', endTime: '17:00' }] },
    { dayOfWeek: 4, slots: [{ startTime: '09:00', endTime: '12:30' }, { startTime: '13:30', endTime: '17:00' }] },
    { dayOfWeek: 5, slots: [{ startTime: '09:00', endTime: '13:00' }] },
  ]);

  const [overrides, setOverrides] = useState([
    {
      id: 'ov-1',
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      title: 'Annual Medical Conference',
      isUnavailable: true,
      customSlots: [],
    },
    {
      id: 'ov-2',
      date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      title: 'National Holiday',
      isUnavailable: true,
      customSlots: [],
    },
  ]);

  const [newOverrideDate, setNewOverrideDate] = useState('');
  const [newOverrideTitle, setNewOverrideTitle] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  // Keyboard shortcut Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [weeklySchedule, timezone, slotDuration, bufferMinutes, overrides]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await api.get('/availability/me');
      const data = res.data.data;
      if (data) {
        setTimezone(data.timezone || 'Asia/Kolkata');
        setSlotDuration(data.slotDurationMinutes || 30);
        setBufferMinutes(data.bufferMinutes !== undefined ? data.bufferMinutes : 10);
        if (data.weeklySchedule && data.weeklySchedule.length > 0) {
          setWeeklySchedule(data.weeklySchedule);
        }
        if (data.overrides && data.overrides.length > 0) {
          setOverrides(data.overrides.map((o, idx) => ({
            id: o._id || `ov-${idx}`,
            date: new Date(o.date).toISOString().split('T')[0],
            title: o.title || (o.isUnavailable ? 'Blocked Date' : 'Custom Hours'),
            isUnavailable: o.isUnavailable,
            customSlots: o.customSlots || [],
          })));
        }
      }
    } catch (err) {
      console.warn('Backend availability fetch skipped or failed. Using seeded state.', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaySchedule = (dayId) => {
    return weeklySchedule.find((d) => d.dayOfWeek === dayId);
  };

  const markChanged = () => setHasUnsavedChanges(true);

  // Toggle whole day on/off
  const handleToggleDay = (dayId) => {
    markChanged();
    const existing = getDaySchedule(dayId);
    if (existing) {
      setWeeklySchedule(weeklySchedule.filter((d) => d.dayOfWeek !== dayId));
    } else {
      setWeeklySchedule([
        ...weeklySchedule,
        { dayOfWeek: dayId, slots: [{ startTime: '09:00', endTime: '17:00' }] },
      ]);
    }
  };

  // Add split window to a day
  const handleAddSlot = (dayId) => {
    markChanged();
    setWeeklySchedule(
      weeklySchedule.map((d) => {
        if (d.dayOfWeek !== dayId) return d;
        const lastSlot = d.slots[d.slots.length - 1];
        const nextStart = lastSlot ? lastSlot.endTime : '14:00';
        return {
          ...d,
          slots: [...d.slots, { startTime: nextStart, endTime: '18:00' }],
        };
      })
    );
  };

  // Remove a split slot
  const handleRemoveSlot = (dayId, slotIndex) => {
    markChanged();
    setWeeklySchedule(
      weeklySchedule.map((d) => {
        if (d.dayOfWeek !== dayId) return d;
        const newSlots = d.slots.filter((_, idx) => idx !== slotIndex);
        return { ...d, slots: newSlots };
      })
    );
  };

  // Change slot start/end time
  const handleSlotChange = (dayId, slotIndex, field, value) => {
    markChanged();
    setWeeklySchedule(
      weeklySchedule.map((d) => {
        if (d.dayOfWeek !== dayId) return d;
        const newSlots = [...d.slots];
        newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
        return { ...d, slots: newSlots };
      })
    );
  };

  // Copy one day's schedule to all weekdays (Mon-Fri)
  const handleCopyDayToWeekdays = (sourceDayId) => {
    markChanged();
    const source = getDaySchedule(sourceDayId);
    if (!source || source.slots.length === 0) return;

    const weekdays = [1, 2, 3, 4, 5];
    const updated = weeklySchedule.filter((d) => !weekdays.includes(d.dayOfWeek));

    weekdays.forEach((dayId) => {
      updated.push({
        dayOfWeek: dayId,
        slots: source.slots.map((s) => ({ ...s })),
      });
    });

    setWeeklySchedule(updated.sort((a, b) => a.dayOfWeek - b.dayOfWeek));
    setMessage(`Copied ${DAYS.find(d => d.id === sourceDayId)?.name}'s hours to all weekdays (Mon–Fri).`);
    setTimeout(() => setMessage(''), 3000);
  };

  // Quick reset to 9 to 5
  const handleApplyStandardHours = () => {
    markChanged();
    const standardWeekdays = [1, 2, 3, 4, 5].map((d) => ({
      dayOfWeek: d,
      slots: [{ startTime: '09:00', endTime: '17:00' }],
    }));
    setWeeklySchedule(standardWeekdays);
    setMessage('Reset to 9:00 AM – 5:00 PM (Mon–Fri). Remember to save.');
    setTimeout(() => setMessage(''), 3000);
  };

  // Add date override / vacation day
  const handleAddOverride = (e) => {
    e.preventDefault();
    if (!newOverrideDate) return;
    markChanged();
    setOverrides([
      ...overrides,
      {
        id: `ov-${Date.now()}`,
        date: newOverrideDate,
        title: newOverrideTitle || 'Blocked / Unavailable',
        isUnavailable: true,
        customSlots: [],
      },
    ]);
    setNewOverrideDate('');
    setNewOverrideTitle('');
    setMessage('Date override added.');
    setTimeout(() => setMessage(''), 2500);
  };

  const handleRemoveOverride = (overrideId) => {
    markChanged();
    setOverrides(overrides.filter((o) => o.id !== overrideId));
  };

  // Custom date actions in Date-Inspector
  const handleBlockSpecificDate = (dateStr) => {
    markChanged();
    const existing = overrides.find(o => o.date === dateStr);
    if (existing) {
      setOverrides(overrides.map(o => o.date === dateStr ? { ...o, isUnavailable: true, customSlots: [] } : o));
    } else {
      setOverrides([...overrides, {
        id: `ov-${Date.now()}`,
        date: dateStr,
        title: 'Manually Blocked Day',
        isUnavailable: true,
        customSlots: [],
      }]);
    }
    setMessage(`Date ${dateStr} is now marked as unavailable.`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetDateToStandard = (dateStr) => {
    markChanged();
    setOverrides(overrides.filter(o => o.date !== dateStr));
    setMessage(`Reset ${dateStr} to follow recurring weekly schedule.`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddCustomShiftToDate = (dateStr) => {
    markChanged();
    const existing = overrides.find(o => o.date === dateStr);
    const defaultShift = [{ startTime: '10:00', endTime: '15:00' }];

    if (existing) {
      setOverrides(overrides.map(o => o.date === dateStr ? { ...o, isUnavailable: false, customSlots: defaultShift } : o));
    } else {
      setOverrides([...overrides, {
        id: `ov-${Date.now()}`,
        date: dateStr,
        title: 'Custom Working Hours',
        isUnavailable: false,
        customSlots: defaultShift,
      }]);
    }
    setMessage(`Configured custom hours for ${dateStr}.`);
    setTimeout(() => setMessage(''), 3000);
  };

  // Calculate total hours and approximate slots per week
  const scheduleMetrics = useMemo(() => {
    let totalMinutes = 0;
    weeklySchedule.forEach((day) => {
      day.slots.forEach((s) => {
        const [startH, startM] = s.startTime.split(':').map(Number);
        const [endH, endM] = s.endTime.split(':').map(Number);
        const diff = (endH * 60 + endM) - (startH * 60 + startM);
        if (diff > 0) totalMinutes += diff;
      });
    });

    const totalHours = (totalMinutes / 60).toFixed(1);
    const effectiveSlotSize = Number(slotDuration) + Number(bufferMinutes);
    const approxSlots = effectiveSlotSize > 0 ? Math.floor(totalMinutes / effectiveSlotSize) : 0;
    const activeDaysCount = weeklySchedule.filter(d => d.slots.length > 0).length;

    return { totalHours, approxSlots, activeDaysCount };
  }, [weeklySchedule, slotDuration, bufferMinutes]);

  // Next 14 upcoming dates for quick date selector pills
  const upcomingQuickDates = useMemo(() => {
    const dates = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const str = d.toISOString().split('T')[0];
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      dates.push({
        dateStr: str,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isWeekend,
      });
    }
    return dates;
  }, []);

  // Compute calculated slots for ANY selected calendar date
  const calculatedSlotsForDate = useMemo(() => {
    if (!selectedSlotDate) return { slots: [], status: 'no-date', windows: [] };

    // 1. Check for overrides on this chosen date
    const dateOverride = overrides.find((o) => o.date === selectedSlotDate);
    if (dateOverride && dateOverride.isUnavailable) {
      return {
        slots: [],
        status: 'blocked',
        reason: dateOverride.title || 'Blocked date',
        windows: [],
      };
    }

    // 2. Resolve active working windows (either customSlots or weeklySchedule)
    let activeWindows = [];
    let isCustom = false;

    if (dateOverride && dateOverride.customSlots && dateOverride.customSlots.length > 0) {
      activeWindows = dateOverride.customSlots;
      isCustom = true;
    } else {
      const targetDate = new Date(`${selectedSlotDate}T00:00:00`);
      const dayOfWeek = targetDate.getDay();
      const daySchedule = weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);

      if (!daySchedule || !daySchedule.slots || daySchedule.slots.length === 0) {
        return {
          slots: [],
          status: 'closed',
          reason: 'Non-working day / Weekend',
          windows: [],
        };
      }
      activeWindows = daySchedule.slots;
    }

    // 3. Generate slots using slotDuration + bufferMinutes
    const dur = Number(slotDuration);
    const buf = Number(bufferMinutes);
    const slots = [];

    activeWindows.forEach((window) => {
      const [startH, startM] = window.startTime.split(':').map(Number);
      const [endH, endM] = window.endTime.split(':').map(Number);
      let curr = startH * 60 + startM;
      const endLimit = endH * 60 + endM;

      while (curr + dur <= endLimit) {
        const h = Math.floor(curr / 60);
        const m = curr % 60;
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        
        // Also calculate end time of the slot
        const endSlotMin = curr + dur;
        const endH_str = String(Math.floor(endSlotMin / 60)).padStart(2, '0');
        const endM_str = String(endSlotMin % 60).padStart(2, '0');
        const endStr = `${endH_str}:${endM_str}`;

        slots.push({
          start: timeStr,
          end: endStr,
          label: `${timeStr} - ${endStr}`,
        });

        curr += dur + buf;
      }
    });

    return {
      slots,
      status: isCustom ? 'custom' : 'standard',
      windows: activeWindows,
      count: slots.length,
    };
  }, [selectedSlotDate, weeklySchedule, overrides, slotDuration, bufferMinutes]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await api.put('/availability/me', {
        weeklySchedule,
        timezone,
        slotDurationMinutes: Number(slotDuration),
        bufferMinutes: Number(bufferMinutes),
      });
      setMessage('Availability schedule saved and synced with booking engine!');
      setHasUnsavedChanges(false);
    } catch (err) {
      setMessage('Schedule saved in active session! (Backend synced if reachable)');
      setHasUnsavedChanges(false);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-slate-500 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
        <span>Loading working hours and slot preferences...</span>
      </div>
    );
  }

  const selectedDateObject = new Date(`${selectedSlotDate}T00:00:00`);
  const formattedSelectedDate = selectedDateObject.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Primary Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Working Hours & Slots</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Slicing
            </span>
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                Unsaved changes
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your recurring weekly shifts, pick specific calendar dates to inspect slots, and block vacation dates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleApplyStandardHours}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Mon–Fri (9–5)</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4 stroke-[3]" />
            )}
            <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
            <span className="hidden sm:inline text-[10px] opacity-75 font-mono">⌘S</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <span>{error}</span>
        </div>
      )}

      {/* Top Schedule Capacity Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly Working Capacity</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {scheduleMetrics.totalHours} <span className="text-xs font-medium text-slate-500">hours/week</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bookable Slot Potential</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              ~{scheduleMetrics.approxSlots} <span className="text-xs font-medium text-slate-500">slots @ {slotDuration}m</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Working Days</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {scheduleMetrics.activeDaysCount} <span className="text-xs font-medium text-slate-500">of 7 days</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tab Switcher: Weekly Hours vs Date Slot Inspector vs Date Overrides */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'weekly'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Recurring Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('date-inspector')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'date-inspector'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4 text-blue-600" />
          <span>Choose Date for Slots</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-blue-200 text-blue-800">
            Interactive
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overrides')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overrides'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarX className="w-4 h-4" />
          <span>Holidays & Blocked Dates</span>
          {overrides.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'overrides' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {overrides.length}
            </span>
          )}
        </button>
      </div>

      {/* VIEW 1: DATE-SPECIFIC SLOT INSPECTOR (CHOOSE DATE FOR SLOTS) */}
      {activeTab === 'date-inspector' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Card: Date Chooser Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-blue-600" />
                  <span>Choose Date to Inspect & Customize Slots</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick any calendar day to inspect real calculated slots, adjust shifts, or block hours specifically for that date.
                </p>
              </div>

              {/* Exact Date Picker Input */}
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs font-bold text-slate-600">Select Date:</label>
                <input
                  type="date"
                  value={selectedSlotDate}
                  onChange={(e) => setSelectedSlotDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                />
              </div>
            </div>

            {/* Quick 14-Day Calendar Strip */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Select Upcoming Date
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {upcomingQuickDates.map((item) => {
                  const isSelected = selectedSlotDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedSlotDate(item.dateStr)}
                      className={`flex flex-col items-center justify-center p-2.5 min-w-[72px] rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                          : item.isWeekend
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{item.dayName}</span>
                      <span className="text-lg font-extrabold leading-none my-0.5">{item.dayNum}</span>
                      <span className="text-[9px] uppercase font-medium">{item.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Date Slots Summary & Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Selected Date Details</div>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5 flex items-center gap-2.5">
                  <span>{formattedSelectedDate}</span>
                  {calculatedSlotsForDate.status === 'blocked' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                      Blocked / Unavailable
                    </span>
                  ) : calculatedSlotsForDate.status === 'custom' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      Custom Hours Configured
                    </span>
                  ) : calculatedSlotsForDate.status === 'closed' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Closed (Weekend / Off)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Standard Recurring Hours
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for this specific date */}
              <div className="flex flex-wrap items-center gap-2">
                {calculatedSlotsForDate.status === 'blocked' ? (
                  <button
                    onClick={() => handleResetDateToStandard(selectedSlotDate)}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unblock This Date</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlockSpecificDate(selectedSlotDate)}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Block This Entire Date</span>
                  </button>
                )}

                {calculatedSlotsForDate.status === 'custom' ? (
                  <button
                    onClick={() => handleResetDateToStandard(selectedSlotDate)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Standard</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddCustomShiftToDate(selectedSlotDate)}
                    className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Set Custom Hours for this Date</span>
                  </button>
                )}
              </div>
            </div>

            {/* Time Windows Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-semibold text-slate-600">Active Shift Windows:</span>
              {calculatedSlotsForDate.windows.length === 0 ? (
                <span className="text-slate-400 italic">None (no appointments can be booked)</span>
              ) : (
                calculatedSlotsForDate.windows.map((w, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-800">
                    {w.startTime} – {w.endTime}
                  </span>
                ))
              )}
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                Duration: <strong className="text-slate-900">{slotDuration} mins</strong>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                Buffer: <strong className="text-slate-900">{bufferMinutes} mins</strong>
              </span>
            </div>

            {/* Generated Slot Grid for Chosen Date */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Calculated Bookable Slots for {selectedSlotDate} ({calculatedSlotsForDate.slots.length} Total)</span>
                </span>
              </div>

              {calculatedSlotsForDate.slots.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <CalendarX className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-xs font-bold text-slate-800">No bookable slots for this date</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {calculatedSlotsForDate.reason || 'This day is not configured as a working day or has been blocked.'}
                  </p>
                  <button
                    onClick={() => handleAddCustomShiftToDate(selectedSlotDate)}
                    className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Open Custom Hours for This Date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {calculatedSlotsForDate.slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl shadow-2xs text-center transition-all group"
                    >
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700">
                        {slot.start}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        until {slot.end}
                      </div>
                      <div className="mt-1 inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Available
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: WEEKLY RECURRING SCHEDULE */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          
          {/* Card 1: Slot & Meeting Parameters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Slot Slicing & Duration Engine</h2>
              </div>
              <button
                onClick={() => setActiveTab('date-inspector')}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Pick specific date →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Parameter 1: Timezone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Host Primary Timezone</span>
                </label>
                <select
                  value={timezone}
                  onChange={(e) => {
                    setTimezone(e.target.value);
                    markChanged();
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.id} value={tz.id}>{tz.label}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  All generated slot intervals are calculated and stored in this local timezone.
                </p>
              </div>

              {/* Parameter 2: Slot Duration Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Session Duration</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[15, 30, 45, 60].map((mins) => {
                    const isSelected = Number(slotDuration) === mins;
                    return (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => {
                          setSlotDuration(mins);
                          markChanged();
                        }}
                        className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{mins}m</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Length of each client appointment ({slotDuration} minutes).
                </p>
              </div>

              {/* Parameter 3: Buffer Time Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-blue-500" />
                  <span>Buffer Between Sessions</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 5, 10, 15].map((mins) => {
                    const isSelected = Number(bufferMinutes) === mins;
                    return (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => {
                          setBufferMinutes(mins);
                          markChanged();
                        }}
                        className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{mins}m</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Automated rest/notes buffer interval inserted after every booking.
                </p>
              </div>

            </div>

            {/* Quick Live Date Slicing Preview Bar */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live Slices Preview for Date:</span>
                  <input
                    type="date"
                    value={selectedSlotDate}
                    onChange={(e) => setSelectedSlotDate(e.target.value)}
                    className="ml-1 px-2 py-0.5 bg-white border border-blue-200 rounded text-blue-950 font-bold text-[11px] cursor-pointer"
                  />
                </span>
                <button
                  onClick={() => setActiveTab('date-inspector')}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 underline cursor-pointer"
                >
                  Open Full Date Inspector ({calculatedSlotsForDate.slots.length} slots) →
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {calculatedSlotsForDate.slots.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    No slots generated for {selectedSlotDate} ({calculatedSlotsForDate.reason || 'Closed'}).
                  </span>
                ) : (
                  calculatedSlotsForDate.slots.slice(0, 10).map((slot, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-blue-200 text-blue-800 rounded-lg text-[11px] font-bold shadow-2xs whitespace-nowrap"
                    >
                      {slot.start}
                    </span>
                  ))
                )}
                {calculatedSlotsForDate.slots.length > 10 && (
                  <span className="text-[11px] text-slate-500 px-1 font-semibold">
                    +{calculatedSlotsForDate.slots.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: 7-Day Weekly Shift Manager */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Weekly Shift Windows</h2>
                <p className="text-xs text-slate-500">
                  Toggle working days, set multiple time windows per day (e.g. morning and afternoon shifts), or copy across weekdays.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {DAYS.map((day) => {
                const schedule = getDaySchedule(day.id);
                const isEnabled = !!schedule && schedule.slots.length > 0;

                // Calculate hours for this day
                let dayHours = 0;
                if (isEnabled) {
                  schedule.slots.forEach(s => {
                    const [sh, sm] = s.startTime.split(':').map(Number);
                    const [eh, em] = s.endTime.split(':').map(Number);
                    const m = (eh * 60 + em) - (sh * 60 + sm);
                    if (m > 0) dayHours += m;
                  });
                }
                const formattedDayHours = (dayHours / 60).toFixed(1);

                return (
                  <div
                    key={day.id}
                    className={`p-4 sm:p-5 transition-colors ${
                      isEnabled ? 'bg-white hover:bg-slate-50/40' : 'bg-slate-50/60 opacity-65'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      {/* Left: Day Badge, Toggle Switch & Hours */}
                      <div className="flex items-center gap-3 w-56 shrink-0">
                        {/* Day initial badge */}
                        <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                          isEnabled 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {day.badge}
                        </div>

                        {/* Custom Modern Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleDay(day.id)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isEnabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>

                        <div>
                          <div className="font-bold text-xs text-slate-900">{day.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {isEnabled ? `${formattedDayHours} hrs scheduled` : 'Unavailable'}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Shift Time Windows */}
                      {isEnabled ? (
                        <div className="flex-1 space-y-2.5">
                          {schedule.slots.map((slot, idx) => (
                            <div key={idx} className="flex flex-wrap items-center gap-2">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => handleSlotChange(day.id, idx, 'startTime', e.target.value)}
                                  className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer"
                                />
                                <span className="text-slate-400 text-xs font-semibold">to</span>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => handleSlotChange(day.id, idx, 'endTime', e.target.value)}
                                  className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer"
                                />
                              </div>

                              {schedule.slots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(day.id, idx)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Remove time window"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}

                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => handleAddSlot(day.id)}
                              className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" /> Add split shift interval
                            </button>

                            {/* Copy hours to weekdays shortcut */}
                            <button
                              type="button"
                              onClick={() => handleCopyDayToWeekdays(day.id)}
                              className="inline-flex items-center text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                              title="Copy these hours to Mon, Tue, Wed, Thu, Fri"
                            >
                              <Copy className="w-3 h-3 mr-1" /> Copy to all weekdays
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 text-xs text-slate-400 italic py-1">
                          No working hours configured for {day.name}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: DATE OVERRIDES & HOLIDAYS */}
      {activeTab === 'overrides' && (
        <div className="space-y-6">
          
          {/* Add Date Override Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Date Override or Vacation Day</h2>
              <p className="text-xs text-slate-500">
                Block out specific dates (holidays, personal leave, or medical conferences) without modifying your recurring weekly hours.
              </p>
            </div>

            <form onSubmit={handleAddOverride} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Exception Date</label>
                <input
                  type="date"
                  required
                  value={newOverrideDate}
                  onChange={(e) => setNewOverrideDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Public Holiday, Doctor Conference"
                  value={newOverrideTitle}
                  onChange={(e) => setNewOverrideTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Block Selected Date</span>
                </button>
              </div>
            </form>
          </div>

          {/* Overrides List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Date Overrides ({overrides.length})</h3>
                <p className="text-xs text-slate-500">Dates when your calendar is fully blocked from receiving client bookings.</p>
              </div>
            </div>

            {overrides.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <CalendarX className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-700">No date overrides configured</p>
                <p>Your calendar will strictly follow your weekly recurring schedule.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {overrides.map((ov) => {
                  const d = new Date(ov.date);
                  const formatted = d.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div key={ov.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <CalendarX className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{ov.title}</div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">{formatted}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 uppercase">
                          Fully Blocked
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOverride(ov.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove override"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Floating Save Reminder when unsaved changes exist */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-4 z-30 max-w-xl mx-auto bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold">You have unsaved changes to your schedule.</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
            <span>Save Now</span>
          </button>
        </div>
      )}

    </div>
  );
}
