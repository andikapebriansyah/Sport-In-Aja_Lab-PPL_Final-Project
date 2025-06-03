import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Booking from 'App/Models/Booking'

export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public category: string

  @column()
  public description: string

  @column()
  public pricePerHour: number

  @column()
  public imageData: string

  @column()
  public isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>
} 