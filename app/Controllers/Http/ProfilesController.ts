import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import ProfileModel from "../../Model/ProfileModel";


export default class ProfilesController {
  public async store(ctx: HttpContextContract) {
    const { request , info } = ctx;
    const profile = new ProfileModel({
      user: info.userId,
      message: info.profile_message,
      imgProfile: request.file("img-profile")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
      banner: request.file("banner")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
      updatedDate: Date.now(),
    });

    await new Promise((resolve, reject) => {
      ProfileModel.create(profile, async (err) => {
        if (err)
          return reject(
            await STATUS.NOT_DELETED(ctx, {
              target: await Message(ctx, "ADRESS"),detail : err.message
            })
          );
        info.savedlist.push({id : profile._id ,idName : "profileId" ,controller : ProfilesController})
        resolve(profile);
      });
    });

    return profile.id;
  }
  public async update(ctx: HttpContextContract) {
    const { request, response , info } = ctx;
    let id = request.param("id");
    const IdToken = request.params().token.id;
    let profile: any;
    try {
      profile = await ProfileModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id)._id,
          user: IdToken,
        },
        {
          imgProfile: info.imgProfile,
          banner: info.banner,
          message: info.message,
          updatedDate: Date.now(),
        },
        {
          returnOriginal: false,
        }
      );
    } catch (e) {
      return await STATUS.NOT_DELETED(ctx, {
        target: await Message(ctx, "ACCOUNT"),detail : e.message
      });
    }
    return response.send(profile);
  }
  public async destroy(ctx: HttpContextContract) {
    const { request ,info } = ctx;
    const IdToken = request.params().token.id;
    const id = info.profileId;
    await ProfileModel.findOneAndRemove(
      {
        _id: id,
        user: IdToken,
      },
      async (err: Error) => {
        if (err)
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "PROFILE"),detail : err.message
          });

        return await STATUS.DELETED(ctx, {
          target: await Message(ctx, "PROFILE"),
        });
      }
    ).clone();
  }
}
