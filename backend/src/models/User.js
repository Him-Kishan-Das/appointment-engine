import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    tenantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tenant', 
      required: true, 
      index: true 
    },
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true 
    },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
      enum: ['host', 'staff', 'client'], 
      default: 'host',
      index: true,
    },
    phone: { type: String, trim: true },
    title: { type: String, trim: true },
  },
  { timestamps: true }
);

// Composite unique index: email must be unique per tenant
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
