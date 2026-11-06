import { addMinutes, format, parse, isBefore, isAfter, startOfDay } from 'date-fns';
import { Availability } from '../models/Availability.js';
import { Booking } from '../models/Booking.js';

export const getAvailableSlotsForDate = async ({ tenantId, hostId, dateStr }) => {
  // 1. Fetch host availability config
  const availability = await Availability.findOne({ tenantId, hostId });
  if (!availability) return [];

  const targetDate = new Date(`${dateStr}T00:00:00`);
  const dayOfWeek = targetDate.getDay(); // 0 = Sun, 1 = Mon ...

  // 2. Check for date overrides (e.g. holidays / sick leaves)
  const override = availability.overrides.find(
    (o) => format(new Date(o.date), 'yyyy-MM-dd') === dateStr
  );

  if (override && override.isUnavailable) {
    return []; // Completely blocked day
  }

  // 3. Resolve active time windows for this day
  let activeWindows = [];
  if (override && override.customSlots && override.customSlots.length > 0) {
    activeWindows = override.customSlots;
  } else {
    const daySchedule = availability.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);
    if (!daySchedule || !daySchedule.slots || daySchedule.slots.length === 0) {
      return []; // Not a working day
    }
    activeWindows = daySchedule.slots;
  }

  // 4. Fetch confirmed/pending bookings on this date to avoid overlaps
  const startOfTarget = startOfDay(targetDate);
  const endOfTarget = new Date(startOfTarget.getTime() + 24 * 60 * 60 * 1000);

  let existingBookings = [];
  try {
    existingBookings = await Booking.find({
      tenantId,
      hostId,
      status: { $in: ['confirmed', 'pending'] },
      startTimeUTC: { $gte: startOfTarget, $lt: endOfTarget }
    });
  } catch {
    // If Booking collection is empty or not yet queried, fallback to []
    existingBookings = [];
  }

  const slotDuration = availability.slotDurationMinutes || 30;
  const buffer = availability.bufferMinutes || 0;
  const generatedSlots = [];

  // 5. Slice each working window into slot units
  for (const window of activeWindows) {
    let windowStart = parse(window.startTime, 'HH:mm', targetDate);
    const windowEnd = parse(window.endTime, 'HH:mm', targetDate);

    while (true) {
      const slotEnd = addMinutes(windowStart, slotDuration);

      if (isAfter(slotEnd, windowEnd)) {
        break;
      }

      // Check collision with existing bookings
      const hasConflict = existingBookings.some((booking) => {
        const bStart = new Date(booking.startTimeUTC);
        const bEnd = new Date(booking.endTimeUTC);
        return isBefore(windowStart, bEnd) && isAfter(slotEnd, bStart);
      });

      if (!hasConflict) {
        generatedSlots.push({
          time: format(windowStart, 'HH:mm'),
          startTimeUTC: windowStart.toISOString(),
          endTimeUTC: slotEnd.toISOString(),
        });
      }

      // Advance by slot duration + buffer minutes
      windowStart = addMinutes(slotEnd, buffer);
    }
  }

  return generatedSlots;
};