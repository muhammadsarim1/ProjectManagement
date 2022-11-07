import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsLoggedIn {
  public async handle
    ({ auth, response }: HttpContextContract, next: () =>
      Promise<void>) {

    await auth.use('api').check()

    if (auth.use("api").isLoggedIn) {
      response.badRequest({ message: "You're already logged in!" })
      return false;
    }

    await next()
  }
}