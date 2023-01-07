import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import AdressModel from "../../Model/AdressModel";

export default class AdressesController {
  public async store({ request }: HttpContextContract) {
    const info = request.body().info;

    const adress = new AdressModel({
      user: info.userId,
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

  public async update(ctx: HttpContextContract) {
    const { request, response } = ctx;
    let id = request.param("id");
    Log("address", "update", request.body());
    Log("address", "id", id);
    let address: any;
    const IdToken = request.params().token.id;

    try {
      address = await AdressModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id)._id,
          user: IdToken,
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
      return await STATUS.NOT_FOUND(ctx, {
        target: await Message(ctx, "ADRESS"),
      });
    }
    if (!address)
      return await STATUS.BAD_AUTH(ctx, {
        target: await Message(ctx, "not authorized thief"),
      });
    return response.send(address);
  }

  public async destroy(ctx: HttpContextContract) {
    const { request } = ctx;
    // let id = request.body().adressId;
    let id = request.param("id") || request.body().accountId;
    let idB = request.body().accountId;
    let idP = request.param("id") ;
    Log("destroyAdress",{id , idB , idP})
    const IdToken = request.params().token.id;
    Log("adress", request.body().adressId);
    await AdressModel.findOneAndRemove(
      {
        _id: idB,
        user: IdToken,
      },
      async (err: Error) => {
        if (err)
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "ADRESS"),
          });
        return await STATUS.DELETED(ctx, {
          target: await Message(ctx, "ADRESS"),
        });
      }
    ).clone();
  }
}
