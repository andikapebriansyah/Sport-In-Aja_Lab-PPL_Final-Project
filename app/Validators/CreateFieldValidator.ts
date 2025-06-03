import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateFieldValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(255),
    ]),
    description: schema.string.optional({ trim: true }, [
      rules.maxLength(1000),
    ]),
    category: schema.enum(['futsal', 'badminton', 'basket', 'voli'] as const),
    pricePerHour: schema.number([
      rules.required(),
      rules.unsigned(),
    ]),
    isAvailable: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'name.required': 'Nama lapangan harus diisi',
    'name.minLength': 'Nama lapangan minimal 3 karakter',
    'name.maxLength': 'Nama lapangan maksimal 255 karakter',
    'description.maxLength': 'Deskripsi maksimal 1000 karakter',
    'category.enum': 'Kategori tidak valid',
    'pricePerHour.required': 'Harga per jam harus diisi',
    'pricePerHour.unsigned': 'Harga per jam harus lebih dari 0',
  }
} 