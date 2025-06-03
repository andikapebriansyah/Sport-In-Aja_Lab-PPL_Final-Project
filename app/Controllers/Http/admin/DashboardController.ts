import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Field from 'App/Models/Field'
import Booking from 'App/Models/Booking'
import { DateTime } from 'luxon'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    // Get total counts
    const totalUsers = await User.query().count('* as total').first()
    const totalFields = await Field.query().count('* as total').first()
    const totalBookings = await Booking.query().count('* as total').first()

    // Get booking counts by status
    const pendingBookings = await Booking.query()
      .where('status', 'pending')
      .count('* as total')
      .first()

    const waitingBookings = await Booking.query()
      .where('status', 'waiting')
      .count('* as total')
      .first()

    const confirmedBookings = await Booking.query()
      .where('status', 'confirmed')
      .count('* as total')
      .first()

    const cancelledBookings = await Booking.query()
      .where('status', 'cancelled')
      .count('* as total')
      .first()

    // Calculate total revenue from confirmed bookings
    const revenue = await Booking.query()
      .where('status', 'confirmed')
      .sum('total_price as total')
      .first()

    // Get recent activities (bookings, new users, new fields)
    const recentBookings = await Booking.query()
      .preload('user')
      .preload('field')
      .orderBy('created_at', 'desc')
      .limit(5)

    const recentUsers = await User.query()
      .orderBy('created_at', 'desc')
      .limit(5)

    const recentFields = await Field.query()
      .orderBy('created_at', 'desc')
      .limit(5)

    // Combine and sort activities
    const activities = [
      ...recentBookings.map(booking => ({
        type: 'booking',
        description: `${booking.user.name} booked ${booking.field.name}`,
        createdAt: booking.createdAt.toFormat('dd LLL yyyy HH:mm'),
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        description: `New user registered: ${user.name}`,
        createdAt: user.createdAt.toFormat('dd LLL yyyy HH:mm'),
      })),
      ...recentFields.map(field => ({
        type: 'field',
        description: `New field added: ${field.name}`,
        createdAt: field.createdAt.toFormat('dd LLL yyyy HH:mm'),
      })),
    ].sort((a, b) => DateTime.fromFormat(b.createdAt, 'dd LLL yyyy HH:mm').toMillis() - 
                     DateTime.fromFormat(a.createdAt, 'dd LLL yyyy HH:mm').toMillis())
                     .slice(0, 10)

    return view.render('admin/dashboard', {
      totalUsers: totalUsers?.$extras.total || 0,
      totalFields: totalFields?.$extras.total || 0,
      totalBookings: totalBookings?.$extras.total || 0,
      pendingBookings: pendingBookings?.$extras.total || 0,
      waitingBookings: waitingBookings?.$extras.total || 0,
      confirmedBookings: confirmedBookings?.$extras.total || 0,
      cancelledBookings: cancelledBookings?.$extras.total || 0,
      totalRevenue: revenue?.$extras.total || 0,
      recentActivities: activities,
    })
  }
} 