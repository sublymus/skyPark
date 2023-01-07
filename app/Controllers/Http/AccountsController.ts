import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import AccountModel from "../../Model/AccountModel";

export default class AccountsController {
  public async store(ctx: HttpContextContract) {
    const { request } = ctx;

    const info = request.body().info;
    Log("user", { info });

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
      AccountModel.create(account)
        .then((account) => {
          resolve(account);
        })
        .catch(async (err) => {
          if (err)
            return reject(
              await STATUS.NOT_FOUND(ctx, {
                target: await Message(ctx, "USER"),
              })
            );
        });
    });
    return {
      accountId: account.id,
      email: account.email,
    };
  }

  public async update(ctx: HttpContextContract) {
    const { request, response } = ctx;
    let id = request.param("id");
    const IdToken = request.params().token.id;
    let account = await AccountModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)._id,
        user: IdToken,
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
      },
      async (error) => {
        if (error)
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "ACCOUNT"),
          });
      }
    ).clone();
    if (!account)
      return await STATUS.BAD_AUTH(ctx, {
        target: await Message(ctx, "not authorized thief"),
      });
    Log("acoount", "update", request.body());
    Log("acoount", "id", id);
    return response.send(account);
  }

  public async destroy(ctx: HttpContextContract) {
    const { request } = ctx;
    let id = request.body().accountId;
    const IdToken = request.params().token.id;
    await AccountModel.findOneAndRemove(
      {
        _id: new mongoose.Types.ObjectId(id)._id,
        user: IdToken,
      },
      async (error: Error) => {
        if (error) {
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "ACCOUNT"),
          });
        }
        return await STATUS.DELETED(ctx, {
          target: await Message(ctx, "ACCOUNT"),
        });
      }
    ).clone();
  }
}
