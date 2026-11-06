import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';

// @desc    Get bookings for the logged-in host
// @route   GET /api/v1/bookings
export const getMyBookings = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const filter = {
      tenantId: req.tenant._id,
      hostId: req.user._id,
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      filter.startTimeUTC = { $gte: startOfDay, $lte: endOfDay };
    }

    const bookings = await Booking.find(filter)
      .sort({ startTimeUTC: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new booking (client or host)
// @route   POST /api/v1/bookings
export const createBooking = async (req, res, next) => {
  try {
    const { hostId, clientName, clientEmail, clientPhone, startTimeUTC, endTimeUTC, meetingType, notes } = req.body;

    // Use hostId from body, or fallback to current logged-in host
    const targetHostId = hostId || req.user?._id;

    if (!targetHostId) {
      return res.status(400).json({
        success: false,
        message: 'Host ID is required to create a booking',
      });
    }

    // Check collision with existing confirmed or pending bookings
    const start = new Date(startTimeUTC);
    const end = new Date(endTimeUTC);

    const collision = await Booking.findOne({
      tenantId: req.tenant._id,
      hostId: targetHostId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startTimeUTC: { $lt: end, $gte: start } },
        { endTimeUTC: { $gt: start, $lte: end } },
        { startTimeUTC: { $lte: start }, endTimeUTC: { $gte: end } },
      ],
    });

    if (collision) {
      return res.status(409).json({
        success: false,
        message: 'The selected time slot is no longer available.',
      });
    }

    const newBooking = await Booking.create({
      tenantId: req.tenant._id,
      hostId: targetHostId,
      clientName,
      clientEmail,
      clientPhone,
      startTimeUTC: start,
      endTimeUTC: end,
      meetingType: meetingType || 'General Consultation',
      notes: notes || '',
      status: 'confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: newBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (e.g. cancel, complete, confirm)
// @route   PATCH /api/v1/bookings/:id/status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided',
      });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: id, tenantId: req.tenant._id },
      { $set: { status } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

