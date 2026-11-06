import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    tenantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tenant', 
      required: true, 
      index: true 
    },
    hostId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      index: true 
    },
    timezone: { type: String, required: true, default: 'UTC' },
    bufferMinutes: { type: Number, default: 10 },
    slotDurationMinutes: { type: Number, default: 30 },

    // Weekly schedule: 0 = Sun, 1 = Mon, ..., 6 = Sat
    weeklySchedule: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6, required: true },
        slots: [
          {
            startTime: { type: String, required: true }, // "09:00"
            endTime: { type: String, required: true },   // "17:00"
          },
        ],
      },
    ],

    // Specific date overrides (holidays, extra hours)
    overrides: [
      {
        date: { type: Date, required: true },
        isUnavailable: { type: Boolean, default: false },
        customSlots: [
          {
            startTime: { type: String },
            endTime: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// One availability document per host inside a tenant
availabilitySchema.index({ tenantId: 1, hostId: 1 }, { unique: true });

export const Availability = mongoose.model('Availability', availabilitySchema);