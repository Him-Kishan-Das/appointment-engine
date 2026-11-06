import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Tenant } from './models/Tenant.js';
import { User } from './models/User.js';
import { Availability } from './models/Availability.js';
import { Booking } from './models/Booking.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('\n[Seeder] Connected to database. Preparing cleanup...');

    // 1. Wipe existing seed collections
    await Promise.all([
      Tenant.deleteMany({}),
      User.deleteMany({}),
      Availability.deleteMany({}),
      Booking.deleteMany({}),
    ]);
    console.log('[Seeder] Cleared existing Tenants, Users, Availability, and Bookings records.');

    // 2. Create Primary Multi-Tenant Organization
    const tenant = await Tenant.create({
      name: 'Apex Health & Wellness',
      slug: 'apex-health',
      plan: 'pro',
      settings: {
        brandColor: '#2563eb',
        logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150',
      },
    });
    console.log(`[Seeder] Created Tenant: ${tenant.name} (slug: ${tenant.slug})`);

    // 3. Create Users for the 3 roles: Host, Staff, Client
    const users = await User.create([
      // ROLE: HOST (Primary Practitioner taking appointments)
      {
        tenantId: tenant._id,
        name: 'Dr. Sarah Connor',
        title: 'Lead Health Practitioner & Specialist',
        email: 'sarah.connor@apexhealth.com',
        password: 'Password123!',
        role: 'host',
        phone: '+1 (555) 200-3000',
      },
      // ROLE: STAFF (Front Desk Receptionist & Patient Coordinator)
      {
        tenantId: tenant._id,
        name: 'Jessica Alba',
        title: 'Front Desk & Patient Coordinator',
        email: 'staff@apexhealth.com',
        password: 'Password123!',
        role: 'staff',
        phone: '+1 (555) 400-5000',
      },
      // ROLE: CLIENT (Registered Patient booking appointments)
      {
        tenantId: tenant._id,
        name: 'Michael Vance',
        title: 'Patient',
        email: 'michael.vance@gmail.com',
        password: 'Password123!',
        role: 'client',
        phone: '+1 (555) 234-8901',
      },
    ]);

    const hostUser = users[0];
    const staffUser = users[1];
    const clientUser = users[2];

    console.log('[Seeder] Created Users across 3 roles:');
    users.forEach((u) => console.log(`   - [${u.role.toUpperCase()}] ${u.name} (${u.email})`));

    // 4. Create Standard Weekly Schedule for Host (Dr. Sarah Connor)
    const sarahWeeklySchedule = [
      {
        dayOfWeek: 1, // Monday
        slots: [
          { startTime: '09:00', endTime: '12:30' },
          { startTime: '13:30', endTime: '17:00' },
        ],
      },
      {
        dayOfWeek: 2, // Tuesday
        slots: [
          { startTime: '09:00', endTime: '12:30' },
          { startTime: '13:30', endTime: '17:00' },
        ],
      },
      {
        dayOfWeek: 3, // Wednesday
        slots: [
          { startTime: '09:00', endTime: '12:30' },
          { startTime: '13:30', endTime: '17:00' },
        ],
      },
      {
        dayOfWeek: 4, // Thursday
        slots: [
          { startTime: '09:00', endTime: '12:30' },
          { startTime: '13:30', endTime: '17:00' },
        ],
      },
      {
        dayOfWeek: 5, // Friday (half day)
        slots: [{ startTime: '09:00', endTime: '13:00' }],
      },
    ];

    const holidayDate = new Date();
    holidayDate.setDate(holidayDate.getDate() + 7);
    holidayDate.setHours(0, 0, 0, 0);

    await Availability.create({
      tenantId: tenant._id,
      hostId: hostUser._id,
      timezone: 'Asia/Kolkata',
      bufferMinutes: 10,
      slotDurationMinutes: 30,
      weeklySchedule: sarahWeeklySchedule,
      overrides: [
        {
          date: holidayDate,
          isUnavailable: true,
          customSlots: [],
        },
      ],
    });

    console.log(`[Seeder] Seeded Availability configuration for ${hostUser.name}.`);

    // 5. Seed Real Initial Bookings for Host
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const seededBookings = await Booking.create([
      {
        tenantId: tenant._id,
        hostId: hostUser._id,
        clientName: clientUser.name,
        clientEmail: clientUser.email,
        clientPhone: clientUser.phone,
        startTimeUTC: new Date(`${today}T09:00:00.000Z`),
        endTimeUTC: new Date(`${today}T09:30:00.000Z`),
        meetingType: 'Clinical Health Review (30 mins)',
        status: 'confirmed',
        notes: 'Annual preventative assessment and blood pressure check.',
      },
      {
        tenantId: tenant._id,
        hostId: hostUser._id,
        clientName: 'Elena Rostova',
        clientEmail: 'elena.rostova@techcorp.io',
        clientPhone: '+1 (555) 891-3402',
        startTimeUTC: new Date(`${today}T10:20:00.000Z`),
        endTimeUTC: new Date(`${today}T10:50:00.000Z`),
        meetingType: 'Follow-up Lab Consultation',
        status: 'confirmed',
        notes: 'Discuss metabolic panel results from previous visit.',
      },
      {
        tenantId: tenant._id,
        hostId: hostUser._id,
        clientName: 'David Kim',
        clientEmail: 'david.kim@example.com',
        clientPhone: '+1 (555) 401-9281',
        startTimeUTC: new Date(`${today}T13:30:00.000Z`),
        endTimeUTC: new Date(`${today}T14:00:00.000Z`),
        meetingType: 'Cardio Wellness Consultation',
        status: 'pending',
        notes: 'Requested review of wearable ECG metrics.',
      },
      {
        tenantId: tenant._id,
        hostId: hostUser._id,
        clientName: 'Sophia Patel',
        clientEmail: 'sophia.p@horizon.org',
        clientPhone: '+1 (555) 772-9104',
        startTimeUTC: new Date(`${today}T15:30:00.000Z`),
        endTimeUTC: new Date(`${today}T16:00:00.000Z`),
        meetingType: 'Lifestyle & Advisory Session',
        status: 'confirmed',
        notes: 'Nutritional planning and stress management check-in.',
      },
      {
        tenantId: tenant._id,
        hostId: hostUser._id,
        clientName: 'Marcus Sterling',
        clientEmail: 'marcus@sterling.co',
        clientPhone: '+1 (555) 301-4491',
        startTimeUTC: new Date(`${tomorrow}T11:00:00.000Z`),
        endTimeUTC: new Date(`${tomorrow}T11:30:00.000Z`),
        meetingType: 'Initial Clinical Intake',
        status: 'confirmed',
        notes: 'First time client intake paperwork completed online.',
      },
    ]);

    console.log(`[Seeder] Seeded ${seededBookings.length} initial bookings in MongoDB.`);

    console.log('\n======================================================');
    console.log('              DATABASE SEEDING COMPLETE               ');
    console.log('======================================================');
    console.log(`Tenant Slug : ${tenant.slug} (${tenant.name})\n`);
    console.log('TEST CREDENTIALS (3 ROLES):');
    console.log('------------------------------------------------------');
    console.log('1. [HOST]   Dr. Sarah Connor (Practitioner)');
    console.log('   Email    : sarah.connor@apexhealth.com');
    console.log('   Password : Password123!');
    console.log('   Role     : host\n');
    console.log('2. [STAFF]  Jessica Alba (Front Desk & Coordinator)');
    console.log('   Email    : staff@apexhealth.com');
    console.log('   Password : Password123!');
    console.log('   Role     : staff\n');
    console.log('3. [CLIENT] Michael Vance (Registered Patient)');
    console.log('   Email    : michael.vance@gmail.com');
    console.log('   Password : Password123!');
    console.log('   Role     : client');
    console.log('======================================================\n');

    await mongoose.connection.close();
    console.log('[Seeder] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
