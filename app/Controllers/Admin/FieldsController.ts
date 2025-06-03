import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Field from 'App/Models/Field'
import CreateFieldValidator from 'App/Validators/CreateFieldValidator'
import UpdateFieldValidator from 'App/Validators/UpdateFieldValidator'

export default class FieldsController {
  public async index({ view }: HttpContextContract) {
    const fields = await Field.all()
    return view.render('admin/fields/index', { fields })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('admin/fields/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    try {
      const data = await request.validate(CreateFieldValidator)
      await Field.create(data)
      
      session.flash('success', 'Lapangan berhasil ditambahkan')
      return response.redirect().toPath('/admin/fields')
    } catch (error) {
      session.flash('errors', error.messages)
      return response.redirect().back()
    }
  }

  public async edit({ params, view }: HttpContextContract) {
    const field = await Field.findOrFail(params.id)
    return view.render('admin/fields/edit', { field })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    try {
      const field = await Field.findOrFail(params.id)

      // Validate the data first
      const validatedData = await request.validate(UpdateFieldValidator)
      
      // Convert isAvailable from string to boolean
      const dataToSave = {
        ...validatedData,
        isAvailable: request.input('isAvailable') === 'true'
      }

      // Update the field
      await field.merge(dataToSave).save()
      
      session.flash('success', 'Lapangan berhasil diperbarui')
      return response.redirect().toPath('/admin/fields')
    } catch (error) {
      console.log('Update error:', error.messages || error)
      session.flash('errors', error.messages || ['Terjadi kesalahan saat memperbarui data'])
      return response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const field = await Field.findOrFail(params.id)
    await field.delete()
    
    session.flash('success', 'Lapangan berhasil dihapus')
    return response.redirect().toPath('/admin/fields')
  }
} 