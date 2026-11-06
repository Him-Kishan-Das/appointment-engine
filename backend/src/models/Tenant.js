import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true 
    },
    plan: { 
      type: String, 
      enum: ['free', 'starter', 'pro'], 
      default: 'free' 
    },
    settings: {
      brandColor: { type: String, default: '#2563eb' },
      logoUrl: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const Tenant = mongoose.model('Tenant', tenantSchema);