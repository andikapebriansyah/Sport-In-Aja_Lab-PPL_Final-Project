import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BookingsController {
  public async index({ view }: HttpContextContract) {
    const bookings = await Booking.query()
      .preload('user')
      .preload('field')
      .orderBy('created_at', 'desc')
    
    return view.render('admin/bookings/index', { bookings })
  }

  public async show({ params, view }: HttpContextContract) {
    const booking = await Booking.query()
      .where('id', params.id)
      .preload('user')
      .preload('field')
      .firstOrFail()

    return view.render('admin/bookings/show', { booking })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)

    const validationSchema = schema.create({
      status: schema.enum(['pending', 'waiting', 'confirmed', 'cancelled'] as const)
    })

    try {
      const data = await request.validate({ schema: validationSchema })
      await booking.merge(data).save()
      
      session.flash('success', 'Status pemesanan berhasil diperbarui')
      return response.redirect().back()
    } catch (error) {
      session.flash('errors', error.messages)
      return response.redirect().back()
    }
  }

  public async confirm({ params, response, session }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)

    if (booking.status !== 'waiting') {
      session.flash('error', 'Pemesanan tidak dapat dikonfirmasi')
      return response.redirect().back()
    }

    booking.status = 'confirmed'
    await booking.save()
    
    session.flash('success', 'Pemesanan berhasil dikonfirmasi')
    return response.redirect().back()
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)
    await booking.delete()
    
    session.flash('success', 'Pemesanan berhasil dihapus')
    return response.redirect().back()
  }
} 