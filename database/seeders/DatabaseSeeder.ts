import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Field from 'App/Models/Field'
import Booking from 'App/Models/Booking'
import { DateTime } from 'luxon'

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    })

    // Create regular users
    const users = await User.createMany([
      {
        name: 'Andika Pebriansyah',
        email: 'andika@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Rizky Yusmansyah',
        email: 'rizky@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Fadli Ahmad yazid',
        email: 'fadli@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Lyra Chaterina',
        email: 'lyra@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Ahmad Fauzi',
        email: 'ahmad@example.com',
        password: 'password123',
        role: 'user'
      }
    ])

    // Create fields
    const fields = await Field.createMany([
      {
        name: 'Lapangan Futsal A',
        category: 'futsal',
        description: 'Lapangan futsal dengan rumput sintetis berkualitas tinggi',
        pricePerHour: 150000,
        isAvailable: true
      },
      {
        name: 'Lapangan Badminton 1',
        category: 'badminton',
        description: 'Lapangan badminton indoor dengan lantai vinyl',
        pricePerHour: 80000,
        isAvailable: true
      },
      {
        name: 'Lapangan Basket Indoor',
        category: 'basket',
        description: 'Lapangan basket indoor dengan lantai parquette',
        pricePerHour: 200000,
        isAvailable: true
      }
    ])

    // Create bookings
    const today = DateTime.now()
    await Booking.createMany([
      {
        userId: users[0].id,
        fieldId: fields[0].id,
        startTime: today.plus({ days: 1 }).set({ hour: 8, minute: 0 }),
        endTime: today.plus({ days: 1 }).set({ hour: 10, minute: 0 }),
        totalPrice: 300000,
        status: 'confirmed'
      },
      {
        userId: users[1].id,
        fieldId: fields[1].id,
        startTime: today.plus({ days: 2 }).set({ hour: 14, minute: 0 }),
        endTime: today.plus({ days: 2 }).set({ hour: 16, minute: 0 }),
        totalPrice: 160000,
        status: 'confirmed'
      },
      {
        userId: users[2].id,
        fieldId: fields[2].id,
        startTime: today.plus({ days: 1 }).set({ hour: 19, minute: 0 }),
        endTime: today.plus({ days: 1 }).set({ hour: 21, minute: 0 }),
        totalPrice: 400000,
        status: 'pending'
      },
      {
        userId: users[3].id,
        fieldId: fields[0].id,
        startTime: today.plus({ days: 3 }).set({ hour: 16, minute: 0 }),
        endTime: today.plus({ days: 3 }).set({ hour: 18, minute: 0 }),
        totalPrice: 300000,
        status: 'confirmed'
      },
      {
        userId: users[4].id,
        fieldId: fields[1].id,
        startTime: today.plus({ days: 2 }).set({ hour: 10, minute: 0 }),
        endTime: today.plus({ days: 2 }).set({ hour: 12, minute: 0 }),
        totalPrice: 160000,
        status: 'pending'
      }
    ])
  }
} 