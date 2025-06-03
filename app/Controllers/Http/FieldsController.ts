import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Field from 'App/Models/Field'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class FieldsController {
  public async index({ view, request }: HttpContextContract) {
    const category = request.input('category', 'all')
    
    // Get unique categories for filter dropdown
    const categoriesResult = await Field.query()
      .distinct('category')
      .orderBy('category', 'asc')
    const categories = categoriesResult.map(field => field.category)

    // Filter fields by category if specified
    const fieldsQuery = Field.query()
    if (category !== 'all') {
      fieldsQuery.where('category', category)
    }
    
    const fields = await fieldsQuery.orderBy('name', 'asc')

    return view.render('user/fields/index', { 
      fields,
      categories,
      selectedCategory: category 
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string(),
      category: schema.string(),
      description: schema.string(),
      pricePerHour: schema.number(),
      imageData: schema.string(),
      isAvailable: schema.boolean.optional(),
    })

    const data = await request.validate({ schema: validationSchema })
    const field = await Field.create(data)

    return response.created(field)
  }

  public async show({ params, view }: HttpContextContract) {
    const field = await Field.findOrFail(params.id)
    
    // Get similar fields (same category)
    const similarFields = await Field.query()
      .where('category', field.category)
      .whereNot('id', field.id)
      .limit(3)

    return view.render('user/fields/show', { field, similarFields })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const field = await Field.findOrFail(params.id)
    const validationSchema = schema.create({
      name: schema.string.optional(),
      category: schema.string.optional(),
      description: schema.string.optional(),
      pricePerHour: schema.number.optional(),
      imageData: schema.string.optional(),
      isAvailable: schema.boolean.optional(),
    })

    const data = await request.validate({ schema: validationSchema })
    await field.merge(data).save()

    return response.ok(field)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const field = await Field.findOrFail(params.id)
    await field.delete()
    return response.ok({ message: 'Field deleted successfully' })
  }
} 