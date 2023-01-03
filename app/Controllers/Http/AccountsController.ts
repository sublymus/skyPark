import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import ERROR from "../../Exceptions/ERROR";
import AccountModel from "../../Model/AccountModel";

export default class AccountsController {
  public async store({ request }: HttpContextContract) {
    const info = request.body().info;
    const account = new AccountModel({
      user: info.userId,
      name: info.name,
      email: info.email,
      password: info.password,
      telephone: info.telephone,
      profile: info.profileId,
      adress: info.adressId,
      favorites: info.favoritesId,
      createdDate: Date.now(),
      updatedDate: Date.now(),
    });

    await new Promise((resolve, reject) => {
      AccountModel.create(account, (err) => {
        if (err) return reject({ err: "account error", message: err.message });
        Log("user", "account cree ");
        resolve(account);
      });
    });
    return {
      accountId: account.id,
      email: account.email,
    };
  }

  public async update({ request, response }: HttpContextContract) {
    let id = request.param("id");
    Log("acoount", "update", request.body());
    Log("acoount", "id", id);
    let account;
    try {
      account = await AccountModel.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id)._id,
        },
        {
          name: request.body().name,
          email: request.body().email,
          password: request.body().password,
          telephone: request.body().telephone,
          updatedDate: Date.now(),
        },
        {
          returnOriginal: false,
        }
      );
    } catch (e) {
      return response.status(403).send("cannot modified info account");
    }

    return response.status(201).send(account);
  }

  public async destroy(ctx: HttpContextContract) {
    const { request } = ctx;
    Log("account", request.body().accountId);
    await AccountModel.findByIdAndDelete(
      {
        _id: request.body().accountId,
      },
      async (err) => { // gerer les type
        if (err) return await ERROR.NOT_DELETED(ctx, { target: "account" });
      }
    ).clone();
  }
}
