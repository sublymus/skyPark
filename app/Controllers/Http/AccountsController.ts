import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccountModel from '../../Model/AccountModel';
import Log from "sublymus_logger";

export default class AccountsController {
  public async index({}: HttpContextContract) {}

  //public async create({}: HttpContextContract) {}

  public async store({request}: HttpContextContract) {
    const info = request.body().info;
    const account = new AccountModel({
      name: info.name,
      email: info.email,
      password: info.password,
      telephone: info.telephone,
      profile: info.profileId,
      adress:  info.adressId,
      favorites:  info.favoritesId,
      createdDate : Date.now(),
      updatedDate : Date.now(),
    });

    await new Promise((resolve, reject) => {
      AccountModel.create(account, (err) => {
        if (err) return reject({ err: "account error", message: err.message });
        Log("user", "account cree ");
        resolve(account);
      });
    });
    return {
      accountId : account.id,
      email : account.email
    };
  }

  public async show({}: HttpContextContract) {}

  //public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
