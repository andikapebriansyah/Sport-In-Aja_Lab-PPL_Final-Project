import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class BookingsController {
  public async userIndex({ auth, view }: HttpContextContract) {
    const user = auth.user!
    const bookings = await Booking.query()
      .where('user_id', user.id)
      .preload('field')
      .preload('user')
      .orderBy('created_at', 'desc')

    return view.render('user/bookings/index', { bookings })
  }

  public async checkAvailability({ request, response }: HttpContextContract) {
    const fieldId = request.input('fieldId')
    const date = request.input('date')
    const startTime = request.input('startTime')
    const duration = parseInt(request.input('duration', '1'))

    if (!fieldId || !date || !startTime) {
      return response.badRequest({ message: 'Missing required fields' })
    }

    // Combine date and time
    const startDateTime = DateTime.fromFormat(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm')
    if (!startDateTime.isValid) {
      return response.badRequest({ message: 'Invalid date or time format' })
    }

    const endDateTime = startDateTime.plus({ hours: duration })

    // Check for overlapping bookings, excluding cancelled ones
    const existingBooking = await Booking.query()
      .where('field_id', fieldId)
      .where('status', 'in', ['pending', 'waiting', 'confirmed']) // Include waiting in active bookings
      .where('start_time', '<', endDateTime.toSQL())
      .where('end_time', '>', startDateTime.toSQL())
      .first()

    return response.json({
      available: !existingBooking
    })
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const user = auth.user!

    const validationSchema = schema.create({
      fieldId: schema.number([
        rules.exists({ table: 'fields', column: 'id' })
      ]),
      date: schema.string([
        rules.regex(/^\d{4}-\d{2}-\d{2}$/)
      ]),
      startTime: schema.string([
        rules.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      ]),
      duration: schema.number([
        rules.range(1, 4)
      ])
    })

    const data = await request.validate({ schema: validationSchema })
    
    // Combine date and time
    const startDateTime = DateTime.fromFormat(`${data.date} ${data.startTime}`, 'yyyy-MM-dd HH:mm')
    if (!startDateTime.isValid) {
      return response.badRequest({ message: 'Invalid date or time format' })
    }

    const endDateTime = startDateTime.plus({ hours: data.duration })

    // Check for overlapping bookings one last time, excluding cancelled ones
    const existingBooking = await Booking.query()
      .where('field_id', data.fieldId)
      .where('status', 'in', ['pending', 'waiting', 'confirmed']) // Include waiting in active bookings
      .where('start_time', '<', endDateTime.toSQL())
      .where('end_time', '>', startDateTime.toSQL())
      .first()

    if (existingBooking) {
      return response.conflict({
        message: 'Lapangan ini sudah dibooking pada waktu dan tanggal yang anda pilih.'
      })
    }

    // Calculate total price
    const field = await Field.findOrFail(data.fieldId)
    const totalPrice = field.pricePerHour * data.duration

    // Create booking
    const booking = await Booking.create({
      userId: user.id,
      fieldId: data.fieldId,
      startTime: startDateTime,
      endTime: endDateTime,
      totalPrice,
      status: 'pending'
    })

    await booking.load('field')
    return response.redirect('/user/bookings')
  }

  public async confirmByUser({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    const booking = await Booking.findOrFail(params.id)

    if (booking.userId !== user.id) {
      return response.forbidden('You are not authorized to confirm this booking')
    }

    if (booking.status !== 'pending') {
      return response.badRequest('Only pending bookings can be confirmed')
    }

    booking.status = 'waiting'
    await booking.save()

    return response.redirect().back()
  }

  public async show({ params, auth, view, response }: HttpContextContract) {
    const user = auth.user!
    const booking = await Booking.query()
      .where('id', params.id)
      .preload('field')
      .preload('user')
      .firstOrFail()

    if (user.role !== 'admin' && booking.userId !== user.id) {
      return response.forbidden('You are not authorized to view this booking')
    }

    return view.render('user/bookings/show', { booking })
  }

  public async cancel({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    const booking = await Booking.findOrFail(params.id)

    if (user.role !== 'admin' && booking.userId !== user.id) {
      return response.forbidden('You are not authorized to cancel this booking')
    }

    if (!['pending', 'waiting'].includes(booking.status)) {
      return response.badRequest('Only pending or waiting bookings can be cancelled')
    }

    booking.status = 'cancelled'
    await booking.save()

    return response.redirect().back()
  }

  public async update({ params, request, auth, response }: HttpContextContract) {
    const user = auth.user!
    const booking = await Booking.findOrFail(params.id)

    if (user.role !== 'admin' && booking.userId !== user.id) {
      return response.forbidden('You are not authorized to update this booking')
    }

    const validationSchema = schema.create({
      status: schema.enum(['pending', 'waiting', 'confirmed', 'cancelled'] as const),
    })

    const data = await request.validate({ schema: validationSchema })
    await booking.merge(data).save()

    return response.redirect().back()
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    const booking = await Booking.findOrFail(params.id)

    if (user.role !== 'admin' && booking.userId !== user.id) {
      return response.forbidden('You are not authorized to delete this booking')
    }

    await booking.delete()

    return response.redirect().back()
  }
} 