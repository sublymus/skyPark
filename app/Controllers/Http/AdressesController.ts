import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import AdressModel from "../../Model/AdressModel";

export default class AdressesController {
  public async index({}: HttpContextContract) {}

  //public async create({}: HttpContextContract) {}

  public async store({ request }: HttpContextContract) {
    const info = request.body().info;

    const adress = new AdressModel({
      location: info.location,
      home: info.home,
      description: info.location_decription,
      updatedDate: Date.now(),
    });

    await new Promise((resolve, reject) => {
      AdressModel.create(adress, (err) => {
        if (err) return reject({ err: "adress error", message: err.message });
        Log("user", "adress cree ");
        resolve(adress);
      });
    });

    return adress.id;
  }

  public async show({}: HttpContextContract) {}

  // public async edit({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {
    let id = request.param("id");
    Log("address", "update", request.body());
    Log("address", "id", id);
    let address;
    try {
      address = await AdressModel.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id)._id,
        },
        {
          location: request.body().location,
          home: request.body().home,
          description: request.body().description,
          updatedDate: Date.now(),
        },
        {
          returnOriginal: false,
        }
      );
    } catch (e) {
      return response.status(403).send("cannot modified info adrress");
    }

    return response.status(201).send(address);
  }

  public async destroy({}: HttpContextContract) {}
}
