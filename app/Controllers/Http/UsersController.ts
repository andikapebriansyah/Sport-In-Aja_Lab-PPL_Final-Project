import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async profile({ view }: HttpContextContract) {
    return view.render('user/profile')
  }

  public async updateProfile({ request, auth, response, session }: HttpContextContract) {
    const user = auth.user!

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

    try {
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