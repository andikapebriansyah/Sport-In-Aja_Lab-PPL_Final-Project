import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminMiddleware {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const user = auth.user
    if (!user || user.role !== 'admin') {
      return response.forbidden('Access restricted to administrators')
    }
    await next()
  }
} 