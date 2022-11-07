import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Authenticated {
  public async handle
    ({ auth, response }: HttpContextContract, next: () =>
      Promise<void>) {

    await auth.use('api').check()

    if (!auth.use("api").isLoggedIn) {
      response.badRequest({ message: "Access Denied" })
      return false;
    }

    await next()
  }
}
