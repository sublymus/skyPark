import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import AccountModel from "../../Model/AccountModel";

export default class AccountsController {
  public async store(ctx: HttpContextContract) {
    const { info } = ctx;
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
          info.savedlist.push({
            id: account._id,
            idName: "accountId",
            controller: AccountsController,
          });
          resolve(account);
        })
        .catch(async (err) => {
          if (err)
            return reject(
              await STATUS.NOT_CREATED(ctx, {
                target: await Message(ctx, "USER"),
                detail: err.message,
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
    const { request, response, info } = ctx;
    let id = request.param("id");
    const IdToken = request.params().token.id;
    let account = await AccountModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)._id,
        user: IdToken,
      },
      {
        name: info.name,
        email: info.email,
        password: info.password,
        telephone: info.telephone,
        updatedDate: Date.now(),
      },
      {
        returnOriginal: false,
      },
      async (error) => {
        if (error)
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "ACCOUNT"),
            detail: error.message,
          });
      }
    ).clone();
    if (!account)
      return await STATUS.BAD_AUTH(ctx, {
        target: await Message(ctx, "not authorized thief"),
      });
    return response.send(account);
  }

  public async destroy(ctx: HttpContextContract) {
    const { request, info } = ctx;
    let id = info.accountId;
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
            detail: error.message,
          });
        }
        return await STATUS.DELETED(ctx, {
          target: await Message(ctx, "ACCOUNT")
        });
      }
    ).clone();
  }
}
