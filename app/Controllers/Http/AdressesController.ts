import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "sublymus_logger";
import AdressModel from "../../Model/AdressModel";

export default class AdressesController {
  public async index({}: HttpContextContract) {}

  //public async create({}: HttpContextContract) {}

  public async store({request}: HttpContextContract) {

    const info = request.body().info;

    const adress = new AdressModel({
      location: info.location,
      home: info.home,
      description: info.location_decription,
      updatedDate: Date.now()
    });

    await new Promise((resolve, reject) => {
      AdressModel.create(adress, (err) => {
        if (err) return reject({ err: "adress error", message: err.message });
        Log("user", "adress cree ");
        resolve(adress);
      });
    });

    return adress;
  }

  public async show({}: HttpContextContract) {}

  // public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
