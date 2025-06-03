/*
|--------------------------------------------------------------------------
| Application providers
|--------------------------------------------------------------------------
|
| This file is used to define providers that are registered globally in the
| application
|
*/

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
*/
export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your AdonisJS app. Anytime you install
| a new library, register its provider inside the `providers` array.
|
*/
export const providers = [
  '@adonisjs/core',
  '@adonisjs/session',
  '@adonisjs/view',
  '@adonisjs/shield',
  '@adonisjs/auth',
  '@adonisjs/lucid'
] 