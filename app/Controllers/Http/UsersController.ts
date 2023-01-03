import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import ERROR from "../../Exceptions/ERROR";
import UserModel from "../../Model/UserModel";
import AccountsController from "./AccountsController";
import AdressesController from "./AdressesController";
import FavoritesController from "./FavoritesController";
import ProfilesController from "./ProfilesController";
export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx;
    const info = request.body().info;

    Log("user", "info : ", info);
    let user;
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

    if (!user) return response.status(404).send("operation not completed");

    Log("auth", user);

    return await new Promise((resolve, reject) => {
      UserModel.create(user, (err) => {
        if (err) return reject({ err: "error", message: err.message });
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
    Log("user", "show", user);
    if (!user) return { status: 404, message: "user not found" };
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
    if (!user ) return await ERROR.NOT_FOUND(ctx , {target : "user"});
   user = await user.populate({
      path : "account"
    })

const account :any = user.account
if(!account) return await ERROR.NOT_FOUND(ctx , {target : "account"});
    request.body().profileId = account.profile?._id.toString();
    request.body().favoritesId = account.favorites?._id.toString();
    request.body().adressId = account.adress?._id.toString();
    request.body().accountId = account._id.toString();

    try {
      await new ProfilesController().destroy(ctx);
      await new AdressesController().destroy(ctx);
      await new FavoritesController().destroy(ctx);
      await new AccountsController().destroy(ctx);
    } catch(e) {
      Log('oops', e)
    }


  await user.remove()
    return "user deleted with succes";
  }
}
