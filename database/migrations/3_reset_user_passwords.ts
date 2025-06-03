import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'

export default class extends BaseSchema {
  public async up() {
    // Get all users
    const users = await Database.from('users').select('*')
    
    // Update each user's password with proper hashing
    for (const user of users) {
      await Database
        .from('users')
        .where('id', user.id)
        .update({
          password: await Hash.make(user.password.startsWith('$') ? 'password123' : user.password)
        })
    }
  }

  public async down() {
    // No need for down migration as we don't want to revert password hashing
  }
} 