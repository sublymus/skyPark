import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import AccountModel from "../../Model/AccountModel";

export default class AccountsController {
  public async index({}: HttpContextContract) {}

  //public async create({}: HttpContextContract) {}

  public async store({ request }: HttpContextContract) {
    const info = request.body().info;
    const account = new AccountModel({
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

  //public async edit({}: HttpContextContract) {}

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
        },
        {
           returnOriginal: false
        }
      );
    } catch (e) {
      return response.status(403).send("cannot modified");
    }
   
    return response.status(201).send(account);
  }

  public async destroy({}: HttpContextContract) {}
}
