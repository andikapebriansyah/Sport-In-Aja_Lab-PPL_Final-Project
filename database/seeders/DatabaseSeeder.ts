import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Field from 'App/Models/Field'

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    // Create admin user with plain password
    await User.create({
      email: 'admin@sportinaja.com',
      password: 'admin123',
      name: 'Administrator',
      role: 'admin'
    })

    // Create regular user with plain password
    await User.createMany([{
      email: 'user@sportinaja.com',
      password: 'user123',
      name: 'user test',
      role: 'user'
    },
    {
      email: 'andika@example.com',
      password: 'user123',
      name: 'andika123',
      role: 'user'
    },
    {
      email: 'fadli@example.com',
      password: 'user123',
      name: 'fadli123',
      role: 'user'
    },
    {
      email: 'rizky@example.com',
      password: 'user123',
      name: 'rizky123',
      role: 'user'
    }
  ])

    // Create sample fields with categories
    await Field.createMany([
      {
        name: 'Lapangan Futsal A',
        category: 'futsal',
        description: 'Lapangan futsal indoor dengan rumput sintetis berkualitas tinggi. Dilengkapi dengan penerangan LED dan sistem drainase modern.',
        pricePerHour: 150000,
        imageData: 'https://images.unsplash.com/photo-1695950695168-f4038b55a9ca?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      },
      {
        name: 'Lapangan Basket Indoor',
        category: 'basket',
        description: 'Lapangan basket indoor dengan lantai vinyl profesional. Dilengkapi dengan ring basket standar FIBA dan papan skor digital.',
        pricePerHour: 200000,
        imageData: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        isAvailable: true
      },
      {
        name: 'Lapangan Voli Indoor',
        category: 'voli',
        description: 'Lapangan voli indoor dengan lantai vinyl profesional. Dilengkapi dengan net standar internasional.',
        pricePerHour: 120000,
        imageData: 'https://images.unsplash.com/photo-1559369064-c4d65141e408?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      },
      {
        name: 'Lapangan Futsal B',
        category: 'futsal',
        description: 'Lapangan futsal outdoor dengan rumput sintetis. Cocok untuk pertandingan casual dan latihan tim.',
        pricePerHour: 120000,
        imageData: 'https://images.unsplash.com/photo-1676444920926-c8a084ec4003?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      },
      {
        name: 'Lapangan Tenis A',
        category: 'tenis',
        description: 'Lapangan tenis dengan permukaan hard court. Dilengkapi dengan bangku istirahat dan pencahayaan malam hari.',
        pricePerHour: 180000,
        imageData: 'https://images.unsplash.com/photo-1719328860730-39653370b843?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      },
      {
        name: 'Lapangan Badminton A',
        category: 'badminton',
        description: 'Lapangan badminton indoor dengan lantai vinyl khusus. Dilengkapi dengan pencahayaan standar turnamen.',
        pricePerHour: 100000,
        imageData: 'https://plus.unsplash.com/premium_photo-1664303134673-7a073bf3fb54?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      },
      {
        name: 'Lapangan Futsal C',
        category: 'futsal',
        description: 'Lapangan futsal indoor premium dengan rumput sintetis kualitas tinggi. Dilengkapi dengan ruang ganti dan shower.',
        pricePerHour: 180000,
        imageData: 'https://images.unsplash.com/photo-1663768423568-c28b243187dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      },
      {
        name: 'Lapangan Basket Outdoor',
        category: 'basket',
        description: 'Lapangan basket outdoor dengan permukaan rubber. Ideal untuk street basketball dan latihan.',
        pricePerHour: 150000,
        imageData: 'https://plus.unsplash.com/premium_photo-1745950166769-aae6afdf3243?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      },
      {
        name: 'Lapangan Voli Pantai',
        category: 'voli',
        description: 'Lapangan voli pantai dengan pasir khusus. Cocok untuk latihan dan turnamen voli pantai.',
        pricePerHour: 140000,
        imageData: 'https://images.unsplash.com/photo-1746735793884-de62a9203958?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isAvailable: true
      }
    ])
  }
} 
