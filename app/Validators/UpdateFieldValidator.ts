import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateFieldValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional([
      rules.minLength(3),
      rules.maxLength(255),
    ]),
    description: schema.string.optional([
      rules.maxLength(1000),
    ]),
    category: schema.string.optional(),
    pricePerHour: schema.number.optional([
      rules.unsigned(),
    ]),
    isAvailable: schema.boolean.optional()
  })

  public messages: CustomMessages = {
    'name.minLength': 'Nama lapangan minimal 3 karakter',
    'name.maxLength': 'Nama lapangan maksimal 255 karakter',
    'description.maxLength': 'Deskripsi maksimal 1000 karakter',
    'pricePerHour.unsigned': 'Harga per jam harus lebih dari 0'
  }
} 