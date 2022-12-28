import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "sublymus_logger";
import AccountModel from "../../Model/AccountModel";
import AdressModel from "../../Model/AdressModel";
import FavoritesModel from "../../Model/FavoritesModel";
import FolderModel from "../../Model/FolderModel";
import ProfileModel from "../../Model/ProfileModel";
import UserModel from "../../Model/UserModel";
export default class UsersController {
  public async index({}: HttpContextContract) {
    Log("user", "index");
  }

  public async create({ request, response }: HttpContextContract) {
    Log("user", "create : ", request.body());
  }

  public async store({ request, response }: HttpContextContract) {
    const info = JSON.parse(request.body().info);
    Log("user", "info : ", info);

    const folder = new FolderModel({
      name: "mes préférences",
      refID: [],
    });

    const favorites = new FavoritesModel({
      folder: [folder._id],
    });
    const adress = new AdressModel({
      location: info.location,
      home: info.home,
      description: info.location_decription,
    });
    const profile = new ProfileModel({
      message: info.profile_message,
      imgProfile: request.file("img-profile")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
      banner: request.file("banner")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
    });
    const account = new AccountModel({
      name: info.name,
      email: adress.id + "@gmail.com",
      password: info.password,
      telephone: info.telephone,
      profile: profile._id,
      adress: adress._id,
      favorites: favorites._id,
    });
    const user = new UserModel({
      account: account._id,
    });

    Log("user", "account : ", account.id);
    try {
      await new Promise((resolve, reject) => {
        UserModel.create(user, (err) => {
          if (err) return reject({ err: "error", message: err.message });
          const token = { email: account.email, userId: user._id };
          Log("user", "token : ", token);
          response.encryptedCookie("token", token);
          Log("allOk", "tout est zoo");
          resolve(user);
        });
      });
      await new Promise((resolve, reject) => {
        AccountModel.create(account, (err) => {
          if (err) return reject({ err: "error", message: err.message });
          Log("user", "account cree ");
          resolve(account);
        });
      });
      await new Promise((resolve, reject) => {
        ProfileModel.create(profile, (err) => {
          if (err) return reject({ err: "error", message: err.message });
          Log("user", "profile cree ");
          resolve(profile);
        });
      });
      await new Promise((resolve, reject) => {
        AdressModel.create(adress, (err) => {
          if (err) return reject({ err: "error", message: err.message });
          Log("user", "adress cree ");
          resolve(adress);
        });
      });
      await new Promise((resolve, reject) => {
        FavoritesModel.create(favorites, (err) => {
          if (err) return reject({ err: "error", message: err.message });
          Log("user", "favorites cree ");
          resolve(favorites);
          // reject({ err: "error", message: err.message });
        });
      });
      await new Promise((resolve, reject) => {
        FolderModel.create(folder, (err) => {
          if (err) return reject({ err: "error", message: err.message });
          Log("user", "folder cree ");
          resolve(folder);
        });
      });
    } catch (e) {
      Log("user", e.message);
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
