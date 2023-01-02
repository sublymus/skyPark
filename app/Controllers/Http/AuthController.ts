import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Log from 'sublymus_logger'
import Error from '../../Exceptions/Error';
import AccountModel from '../../Model/AccountModel';

import UsersController from './UsersController';

export default class AuthController {
  constructor() {}

  async login(ctx: HttpContextContract) {
    const { request, response } = ctx
    let info = JSON.parse(request.body().info)
    let account ;
    try {
      account = await AccountModel.findOne({
        email: info.email,
        password: info.password,
      })
    } catch (e) {
      Log('err', 'errr')
    }
    Log('user', account)
    if (!account)return  await Error.BAD_AUTH(ctx);
    
   
    const token =  { email: info.email, name: info.name , id : account.user._id };
    response.encryptedCookie('token',token);
    return account.user._id +'c\'est zoo , bienvenu'+ account.name
  }
  async signup(ctx: HttpContextContract) {
    let { request, response }= ctx;
    const info = request.body().info = JSON.parse(request.body().info);
   Log('auth',info)
    const result : any  = await new UsersController().store(ctx);
    
   if(result?.err){
    Log('auth', result);
    return result;
   }
   response.encryptedCookie('token', { email: info.email, name: info.name, id : result })
   response.send({
      res : 'allOK'
   })
   //response.redirect('/')
  }
}
