import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class UsersController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10
    
    const users = await User.query()
      .where('role', 'user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
    
    return view.render('admin/users/index', { users })
  }

  public async show({ params, view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10
    
    const user = await User.findOrFail(params.id)
    const bookings = await user.related('bookings')
      .query()
      .preload('field')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    // Format dates for each booking
    bookings.forEach((booking) => {
      if (booking.startTime) {
        booking.startTime = DateTime.fromJSDate(booking.startTime.toJSDate())
      }
      if (booking.endTime) {
        booking.endTime = DateTime.fromJSDate(booking.endTime.toJSDate())
      }
    })

    return view.render('admin/users/show', { user, bookings })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['name', 'email'])
    await user.merge(data).save()
    
    session.flash('success', 'User updated successfully')
    return response.redirect().back()
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    
    session.flash('success', 'User deleted successfully')
    return response.redirect().toPath('/admin/users')
  }

  public async profile({ view }: HttpContextContract) {
    return view.render('admin/profile')
  }

  public async updateProfile({ auth, request, response, session }: HttpContextContract) {
    const user = auth.user!

    try {
      const validationSchema = schema.create({
        name: schema.string({ trim: true }, [
          rules.maxLength(255)
        ]),
        email: schema.string({ trim: true }, [
          rules.email(),
          rules.maxLength(255),
          rules.unique({ table: 'users', column: 'email', whereNot: { id: user.id } })
        ])
      })

      const data = await request.validate({ schema: validationSchema })
      await user.merge(data).save()

      session.flash('success', 'Profile updated successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('errors', error.messages)
      return response.redirect().back()
    }
  }
} 