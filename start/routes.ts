/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Guest routes
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/login', 'AuthController.showLogin')
Route.post('/login', 'AuthController.login')
Route.get('/register', 'AuthController.showRegister')
Route.post('/register', 'AuthController.register')
Route.post('/logout', 'AuthController.logout')

// User routes
Route.group(() => {
  Route.get('/home', 'HomeController.userHome')
  
  Route.get('/fields', 'FieldsController.index')
  Route.get('/fields/:id', 'FieldsController.show')
  
  Route.get('/bookings', 'BookingsController.userIndex')
  Route.get('/bookings/check-availability', 'BookingsController.checkAvailability')
  Route.post('/bookings', 'BookingsController.store')
  Route.get('/bookings/:id', 'BookingsController.show')
  Route.post('/bookings/:id/confirm', 'BookingsController.confirmByUser')
  Route.post('/bookings/:id/cancel', 'BookingsController.cancel')
  Route.put('/bookings/:id', 'BookingsController.update')
  Route.delete('/bookings/:id', 'BookingsController.destroy')
  
  Route.get('/profile', 'UsersController.profile')
  Route.post('/profile/update', 'UsersController.updateProfile')
}).prefix('/user').middleware(['auth', 'role:user'])

// Admin routes
Route.group(() => {
  Route.get('/dashboard', 'Admin/DashboardController.index')
  
  Route.get('/fields', 'Admin/FieldsController.index')
  Route.get('/fields/create', 'Admin/FieldsController.create')
  Route.post('/fields', 'Admin/FieldsController.store')
  Route.get('/fields/:id/edit', 'Admin/FieldsController.edit')
  Route.post('/fields/:id/update', 'Admin/FieldsController.update')
  Route.post('/fields/:id/delete', 'Admin/FieldsController.destroy')
  
  Route.get('/bookings', 'Admin/BookingsController.index')
  Route.get('/bookings/:id', 'Admin/BookingsController.show')
  Route.post('/bookings/:id/confirm', 'Admin/BookingsController.confirm')
  Route.post('/bookings/:id/delete', 'Admin/BookingsController.destroy')
  
  Route.get('/users', 'Admin/UsersController.index')
  Route.get('/users/:id', 'Admin/UsersController.show')
  Route.post('/users/:id/update', 'Admin/UsersController.update')
  Route.post('/users/:id/delete', 'Admin/UsersController.destroy')
  
  Route.get('/profile', 'Admin/UsersController.profile')
  Route.post('/profile/update', 'Admin/UsersController.updateProfile')
}).prefix('/admin').middleware(['auth', 'role:admin'])
