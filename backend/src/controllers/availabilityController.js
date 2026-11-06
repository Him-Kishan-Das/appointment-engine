import { Availability } from '../models/Availability.js';
import { getAvailableSlotsForDate } from '../services/slotService.js';

// @desc    Get current host's availability configuration
// @route   GET /api/v1/availability/me
export const getMyAvailability = async (req, res, next) => {
  try {
    let availability = await Availability.findOne({
      tenantId: req.tenant._id,
      hostId: req.user._id,
    });

    // Fallback initialize if not found
    if (!availability) {
      availability = await Availability.create({
        tenantId: req.tenant._id,
        hostId: req.user._id,
        timezone: 'Asia/Kolkata',
        slotDurationMinutes: 30,
        bufferMinutes: 10,
        weeklySchedule: [1, 2, 3, 4, 5].map((day) => ({
          dayOfWeek: day,
          slots: [{ startTime: '09:00', endTime: '17:00' }],
        })),
      });
    }

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update host weekly schedule and time preferences
// @route   PUT /api/v1/availability/me
export const updateMyAvailability = async (req, res, next) => {
  try {
    const { weeklySchedule, timezone, bufferMinutes, slotDurationMinutes } = req.body;

    const availability = await Availability.findOneAndUpdate(
      { tenantId: req.tenant._id, hostId: req.user._id },
      {
        $set: {
          ...(weeklySchedule && { weeklySchedule }),
          ...(timezone && { timezone }),
          ...(bufferMinutes !== undefined && { bufferMinutes: Number(bufferMinutes) }),
          ...(slotDurationMinutes !== undefined && { slotDurationMinutes: Number(slotDurationMinutes) }),
        },
      },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: availability,
      message: 'Schedule updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available slots for a specific host & date
// @route   GET /api/v1/availability/slots
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { date, hostId } = req.query;
    const targetHostId = hostId || req.user?._id;

    if (!targetHostId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Both hostId (or authenticated session) and date (YYYY-MM-DD) are required.',
      });
    }

    const slots = await getAvailableSlotsForDate({
      tenantId: req.tenant._id,
      hostId: targetHostId,
      dateStr: date,
    });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};
