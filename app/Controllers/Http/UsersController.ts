import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import Message from "../../Exceptions/Message";
import ERROR from "../../Exceptions/STATUS";
import UserModel from "../../Model/UserModel";
import AccountsController from "./AccountsController";
import AdressesController from "./AdressesController";
import FavoritesController from "./FavoritesController";
import ProfilesController from "./ProfilesController";
export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const { request } = ctx;
    const info = request.body().info;
    Log("user", "info : ", info);
    let user: any;
    try {
      const userId = new mongoose.Types.ObjectId()._id;
      info.userId = userId;
      const profileId = await new ProfilesController().store(ctx);
      info.profileId = profileId;

      const favoritesId = await new FavoritesController().store(ctx);
      info.favoritesId = favoritesId;

      const adressId = await new AdressesController().store(ctx);
      info.adressId = adressId;

      info.email = Date.now().toString() + "@gmail.com";
      const { accountId } = await new AccountsController().store(ctx);
      user = new UserModel({
        _id: userId,
        account: accountId as string,
      });
    } catch (e) {
      Log("user", "err: ", e);
    }
    if (!user)
      return await ERROR.NOT_FOUND(ctx, { target: await Message(ctx, "USER") });

    Log("auth", user);

    return await new Promise((resolve, reject) => {
      UserModel.create(user, async (err: Error) => {
        if (err)
          return reject(
            await ERROR.NOT_FOUND(ctx, { target: await Message(ctx, "USER") })
          );
        resolve(user.id);
      });
    });
  }
  public async show(ctx: HttpContextContract) {
    const { request } = ctx;
    const id = request.params().id;

    const user = await UserModel.findOne(
      {
        _id: new mongoose.Types.ObjectId(id)._id,
      },
      {
        __v: 0,
      }
    );
    if (!user)
      return await ERROR.NOT_FOUND(ctx, { target: await Message(ctx, "USER") });
    await user.populate({
      path: "account",
      select: "-__v -password",
      populate: [
        {
          path: "adress",
          select: "-__v",
        },
        {
          path: "profile",
          select: "-__v",
        },
      ],
    });

    return user;
  }

  public async destroy(ctx: HttpContextContract) {
    const { request } = ctx;
    const id = request.param("id");
    let user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
    });
    if (!user) return await ERROR.NOT_FOUND(ctx, { target: "user" });
    user = await user.populate({
      path: "account",
    });

    const account: any = user.account;
    if (!account) return await ERROR.NOT_FOUND(ctx, { target: "account" });
    request.body().profileId = account.profile?._id.toString();
    request.body().favoritesId = account.favorites?._id.toString();
    request.body().adressId = account.adress?._id.toString();
    request.body().accountId = account._id.toString();
    try {
    Log("user", request.body());
      await new ProfilesController().destroy(ctx);
      await new AdressesController().destroy(ctx);
      await new FavoritesController().destroy(ctx);
      await new AccountsController().destroy(ctx);
    } catch (e) {
      Log("oops", e);
    }

    await user.remove();
    return "user deleted with succes";
  }
}
