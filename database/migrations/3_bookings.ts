import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('field_id').unsigned().references('id').inTable('fields').onDelete('CASCADE')
      table.dateTime('start_time').notNullable()
      table.dateTime('end_time').notNullable()
      table.decimal('total_price', 10, 2).notNullable()
      table.enum('status', ['pending', 'waiting', 'confirmed', 'cancelled']).defaultTo('pending')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
} 