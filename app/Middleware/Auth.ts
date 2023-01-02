import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Log from 'sublymus_logger'
import Error from '../Exceptions/Error'

export default class Auth {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const {request, response} = ctx
    const token = request.encryptedCookie('token')
    Log('token', token)

   
  if (!token){
    const rest = await Error.BAD_AUTH(ctx)
    return response.send(rest)
  }
  
  await next()
  }
}
