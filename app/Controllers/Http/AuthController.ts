import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import AccountModel from "../../Model/AccountModel";

import UsersController from "./UsersController";

export default class AuthController {
  constructor() {}

  async login(ctx: HttpContextContract) {
    const { response, info } = ctx;

    let account: any;
    try {
      account = await AccountModel.findOne({
        email: info.email,
        password: info.password,
      });
    } catch (e) {
      return await STATUS.NOT_FOUND(ctx, {
        target: await Message(ctx, "Account"),
        detail : e.message
      });
    }
    if (!account) return await STATUS.BAD_AUTH(ctx);
    const token = { email: info.email, name: info.name, id: account.user._id };
    response.encryptedCookie("token", token);
    return account.user._id;
  }
  async signup(ctx: HttpContextContract) {
    let { response, info } = ctx;
    const result: any = await new UsersController().store(ctx);
    if (result?.status) {
      return response.send(result);
    }
    response.encryptedCookie("token", {
      email: info.email,
      name: info.name,
      id: result,
    });
    return result;
    //response.redirect('/')
  }
}
