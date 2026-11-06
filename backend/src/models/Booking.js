import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      trim: true,
    },
    startTimeUTC: {
      type: Date,
      required: true,
      index: true,
    },
    endTimeUTC: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
      index: true,
    },
    meetingType: {
      type: String,
      default: 'General Consultation',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent double booking overlapping slots for the same host
bookingSchema.index({ hostId: 1, startTimeUTC: 1, endTimeUTC: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);

