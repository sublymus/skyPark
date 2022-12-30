import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "sublymus_logger";
import UserModel from "../../Model/UserModel";
import AccountsController from "./AccountsController";
import AdressesController from "./AdressesController";
import FavoritesController from "./FavoritesController";
import ProfilesController from "./ProfilesController";
export default class UsersController {
  public async index({}: HttpContextContract) {
    Log("user", "index");
  }

  public async create({ request }: HttpContextContract) {
    Log("user", "create : ", request.body());
  }

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx;
    const info = request.body().info = JSON.parse(request.body().info);

    Log("user", "info : ", info);
    let  user ;
    let mail: string;
    try {
      const profileId = await new ProfilesController().store(ctx);
      info.profileId = profileId;
      const favoritesId = await new FavoritesController().store(ctx);
      info.favoritesId = favoritesId;
      const adressId = await new AdressesController().store(ctx);
      info.adressId = adressId;
      info.email = adressId + "@gmail.com";
      const {accountId, email } = await new AccountsController().store(ctx);
      mail = email
      user = new UserModel({
      account: (accountId as string),
    });

    } catch (e) {
      Log("user", "err: ", e);
    }

    if (!user) return response

    try {
      await new Promise((resolve, reject) => {
        UserModel.create(user, (err) => {
          if (err) return reject({ err: "error", message: err.message });
          const token = { email: mail, userId: user._id };
          Log("user", "token : ", token);
          response.encryptedCookie("token", token);
          Log("allOk", "tout est zoo");
          resolve(user);
        });
      });
    }catch(e){
      Log('user', 'creation err : ', e.message );
    }
    response.send(request.body());
  }

  public async show({}: HttpContextContract) {
    Log("user", "show");
  }

  public async edit({}: HttpContextContract) {
    Log("user", "edit");
  }

  public async update({}: HttpContextContract) {
    Log("user", "update");
  }

  public async destroy({}: HttpContextContract) {
    Log("user", "destroy");
  }
}
