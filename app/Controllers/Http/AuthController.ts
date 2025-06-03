import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public async showLogin({ view, auth, response }: HttpContextContract) {
    // If user is already logged in, redirect them
    if (auth.isLoggedIn) {
      return this.redirectBasedOnRole(response, auth.user!)
    }
    return view.render('auth/login')
  }

  public async showRegister({ view, auth, response }: HttpContextContract) {
    // If user is already logged in, redirect them
    if (auth.isLoggedIn) {
      return this.redirectBasedOnRole(response, auth.user!)
    }
    return view.render('auth/register')
  }

  public async register({ request, response, session, auth }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email' }),
        ]),
        password: schema.string({}, [
          rules.minLength(8),
          rules.confirmed('passwordConfirmation')
        ]),
        name: schema.string({}, [
          rules.minLength(3),
          rules.maxLength(255)
        ]),
      })

      const data = await request.validate({ schema: validationSchema })
      
      const user = await User.create({
        email: data.email,
        password: data.password, // Store password without hashing
        name: data.name,
        role: 'user', // Default role is user
      })

      // Auto login after registration
      await auth.use('web').login(user)
      
      session.flash('success', 'Registrasi berhasil! Selamat datang di Sport Inaja.')
      return response.redirect('/user/home')
    } catch (error) {
      console.error('Register error:', error)
      if (error.messages) {
        session.flash('errors', error.messages)
      } else {
        session.flash('error', 'Gagal mendaftar. Silakan coba lagi.')
      }
      return response.redirect().back()
    }
  }

  public async login({ request, auth, response, session }: HttpContextContract) {
    try {
      console.log('Login attempt - Request body:', request.body())
      
      const { email, password } = await request.validate({
        schema: schema.create({
          email: schema.string({}, [rules.email()]),
          password: schema.string(),
        }),
      })

      // Find user first
      const user = await User.findBy('email', email)
      if (!user) {
        console.log('Login failed - User not found:', email)
        session.flash('error', 'Email tidak ditemukan')
        return response.redirect().back()
      }

      // Simple password check
      if (user.password !== password) {
        console.log('Login failed - Invalid password for user:', email)
        session.flash('error', 'Password yang Anda masukkan salah')
        return response.redirect().back()
      }

      // Login with session
      await auth.use('web').login(user)
      
      console.log('Login successful - User:', email)
      session.flash('success', 'Login berhasil!')

      // Redirect based on role
      if (user.role === 'admin') {
        return response.redirect('/admin/dashboard')
      } else {
        return response.redirect('/user/home')
      }
    } catch (error) {
      console.error('Login error:', error)
      session.flash('error', 'Gagal login. Silakan coba lagi.')
      return response.redirect().back()
    }
  }

  public async logout({ auth, response, session }: HttpContextContract) {
    await auth.use('web').logout()
    session.flash('success', 'Anda telah berhasil logout.')
    return response.redirect('/')
  }

  private redirectBasedOnRole(response, user) {
    if (user.role === 'admin') {
      return response.redirect('/admin/dashboard')
    } else {
      return response.redirect('/user/home')
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    try {
      await auth.use('web').authenticate()
      return response.json(auth.user)
    } catch (error) {
      return response.redirect('/login')
    }
  }
} 