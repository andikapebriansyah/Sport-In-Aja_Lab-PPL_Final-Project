import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    roles: string[]
  ) {
    const user = auth.user
    
    if (!user) {
      return response.redirect('/login')
    }

    if (!roles.includes(user.role)) {
      if (user.role === 'admin') {
        return response.redirect('/admin/dashboard')
      } else {
        return response.redirect('/user/home')
      }
    }

    await next()
  }
} 