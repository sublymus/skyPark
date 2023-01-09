import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import AdressModel from "../../Model/AdressModel";

export default class AdressesController {
  public async store(ctx: HttpContextContract) {
   const { info } = ctx
    const adress = new AdressModel({
      user: info.userId,
      location: info.location,
      home: info.home,
      description: info.location_decription,
      updatedDate: Date.now(),
    });

    await new Promise((resolve, reject) => {
      AdressModel.create(adress,async (err) => {
        if (err) return reject(await STATUS.NOT_CREATED(ctx, { target : await Message(ctx , 'ADRESS' ) , detail: err.message } ));
        info.savedlist.push({
          id: adress._id,
          idName: "adressId",
          controller: AdressesController,
        });
        resolve(adress);
      });
    });

    return adress.id;
  }

  public async update(ctx: HttpContextContract) {
    const { request, response, info } = ctx;
    let id = request.param("id");
    let address: any;
    const IdToken = request.params().token.id;
    try {
      address = await AdressModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id)._id,
          user: IdToken,
        },
        {
          location: info.location,
          home: info.home,
          description: info.description,
          updatedDate: Date.now(),
        },
        {
          returnOriginal: false,
        }
      );
    } catch (e) {
      return await STATUS.NOT_FOUND(ctx, {
        target: await Message(ctx, "ADRESS"), detail : e.message
      });
    }
    if (!address)
      return await STATUS.BAD_AUTH(ctx, {
        target: await Message(ctx, "not authorized thief")
      });
    return response.send(address);
  }

  public async destroy(ctx: HttpContextContract) {
    const { request, info } = ctx;
    let id = info.adressId;
    const IdToken = request.params().token.id;
    await AdressModel.findOneAndRemove(
      {
        _id: id,
        user: IdToken,
      },
      async (err: Error) => {
        if (err)
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "ADRESS"),detail : err.message
          });
        return await STATUS.DELETED(ctx, {
          target: await Message(ctx, "ADRESS"),
        });
      }
    ).clone();
  }
}
