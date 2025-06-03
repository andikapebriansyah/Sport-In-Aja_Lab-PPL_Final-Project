import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'

export default class HomeController {
  public async userHome({ view, auth }: HttpContextContract) {
    const userId = auth.user!.id
    console.log('User ID:', userId)

    const activeBookings = await Booking.query()
      .where('user_id', userId)
      .where('status', 'confirmed')
      .count('* as total')
    console.log('Active Bookings:', activeBookings[0]?.$extras.total)

    const recentBookings = await Booking.query()
      .where('user_id', userId)
      .preload('field')
      .orderBy('created_at', 'desc')
      .limit(5)
    console.log('Recent Bookings:', recentBookings.map(b => ({
      id: b.id,
      fieldName: b.field?.name,
      status: b.status,
      createdAt: b.createdAt
    })))

    const featuredFields = await Field.query()
      .where('is_available', true)
      .limit(3)

    return view.render('user/home', {
      activeBookings: activeBookings[0]?.$extras.total || 0,
      recentBookings,
      featuredFields
    })
  }
} 