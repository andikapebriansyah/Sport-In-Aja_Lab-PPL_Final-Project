import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Field from 'App/Models/Field'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'

interface UpdateFieldData {
  name?: string
  description?: string
  pricePerHour?: number
  category?: string
  isAvailable?: boolean
  image?: any
  imageData?: string
}

export default class FieldsController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const fields = await Field.query()
      .orderBy('created_at', 'desc')
      .paginate(page, 6)
    
    return view.render('admin/fields/index', { fields })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('admin/fields/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.maxLength(50),
        rules.unique({ table: 'fields', column: 'name' })
      ]),
      description: schema.string({ trim: true }, [
        rules.maxLength(500)
      ]),
      pricePerHour: schema.number([
        rules.unsigned()
      ]),
      category: schema.string(),
      isAvailable: schema.boolean.optional(),
      image: schema.file({
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
      })
    })

    try {
      const data = await request.validate({ schema: validationSchema })
      
      // Move file to temp directory first
      const tempPath = Application.tmpPath('uploads')
      const fileName = `${new Date().getTime()}.${data.image.extname}`
      
      try {
        await data.image.move(tempPath, {
          name: fileName
        })
      } catch (error) {
        session.flash('errors', { image: 'Failed to upload image' })
        return response.redirect().back()
      }

      // Read the file and convert to base64
      const filePath = `${tempPath}/${fileName}`
      const imageBuffer = fs.readFileSync(filePath)
      const base64Image = `data:${data.image.type};base64,${imageBuffer.toString('base64')}`
      
      // Delete the temp file
      fs.unlinkSync(filePath)
      
      // Create field with image data
      await Field.create({
        name: data.name,
        description: data.description,
        pricePerHour: data.pricePerHour,
        category: data.category,
        isAvailable: data.isAvailable ?? true,
        imageData: base64Image
      })

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

      const validationSchema = schema.create({
        name: schema.string.optional({ trim: true }, [
          rules.maxLength(50),
          rules.unique({ table: 'fields', column: 'name', whereNot: { id: params.id } })
        ]),
        description: schema.string.optional({ trim: true }, [
          rules.maxLength(500)
        ]),
        pricePerHour: schema.number.optional([
          rules.unsigned()
        ]),
        category: schema.string.optional(),
        isAvailable: schema.boolean.optional(),
        image: schema.file.optional({
          size: '10mb',
          extnames: ['jpg', 'jpeg', 'png', 'gif'],
        })
      })

      const data: UpdateFieldData = await request.validate({ schema: validationSchema })
      
      // Handle image update if new image is uploaded
      if (data.image) {
        // Move file to temp directory first
        const tempPath = Application.tmpPath('uploads')
        const fileName = `${new Date().getTime()}.${data.image.extname}`
        
        try {
          await data.image.move(tempPath, {
            name: fileName
          })
        } catch (error) {
          session.flash('errors', { image: 'Failed to upload image' })
          return response.redirect().back()
        }

        // Read the file and convert to base64
        const filePath = `${tempPath}/${fileName}`
        const imageBuffer = fs.readFileSync(filePath)
        const base64Image = `data:${data.image.type};base64,${imageBuffer.toString('base64')}`
        
        // Delete the temp file
        fs.unlinkSync(filePath)
        
        // Update image data
        data.imageData = base64Image
      }
      
      // Update field with new data
      await field.merge({
        name: data.name,
        description: data.description,
        pricePerHour: data.pricePerHour,
        category: data.category,
        isAvailable: data.isAvailable,
        ...(data.imageData && { imageData: data.imageData })
      }).save()
      
      session.flash('success', 'Lapangan berhasil diperbarui')
      return response.redirect().toPath('/admin/fields')
    } catch (error) {
      console.log('Update error:', error)
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