import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Availability } from '../models/Availability.js';

// Schemas for request payload validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['host', 'staff', 'client']).optional(),
  timezone: z.string().optional().default('UTC'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Helper to sign JWT & set HttpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, tenantId: user.tenantId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
};

// @desc    Register a new host user within current tenant
// @route   POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, password, role, timezone } = parseResult.data;

    // Check for existing user scoped to this tenant
    const existingUser = await User.findOne({
      tenantId: req.tenant._id,
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists under this tenant workspace.',
      });
    }

    // Create User
    const user = await User.create({
      tenantId: req.tenant._id,
      name,
      email,
      password,
      role: role || 'host',
    });

    // Auto-initialize standard default availability if user is a host
    if (user.role === 'host') {
      await Availability.create({
        tenantId: req.tenant._id,
        hostId: user._id,
        timezone: timezone || 'UTC',
        weeklySchedule: [1, 2, 3, 4, 5].map((day) => ({
          dayOfWeek: day,
          slots: [{ startTime: '09:00', endTime: '17:00' }],
        })),
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user within current tenant
// @route   POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parseResult.data;

    // Must explicitly select password due to `select: false` on schema
    const user = await User.findOne({
      tenantId: req.tenant._id,
      email: email.toLowerCase(),
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/v1/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    tenant: {
      id: req.tenant._id,
      name: req.tenant.name,
      slug: req.tenant.slug,
    },
  });
};

// @desc    Logout user & clear cookie
// @route   POST /api/v1/auth/logout
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};