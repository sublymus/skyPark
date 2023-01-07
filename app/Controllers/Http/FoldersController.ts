import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import FavoritesModel from "../../Model/FavoritesModel";
import FolderModel from "../../Model/FolderModel";

export default class FoldersController {
  public async store(ctx: HttpContextContract) {
    const { request } = ctx;
    let info: any;
    if (typeof request.body().info == "string") {
      Log("folder", " string : ", true);
      info = request.body().info = JSON.parse(request.body().info);
    } else {
      info = request.body().info;
    }
    Log("folder", "favoritesId", info.favoritesID);
    const favorites = await FavoritesModel.findOne({
      _id: info.favoritesID,
    });

    if (!favorites)
      return await STATUS.NOT_FOUND(ctx, {
        target: await Message(ctx, "FAVORITES"),
      });

    Log("user", info);
    const folder = new FolderModel({
      user: info.userId,
      folderName: info.folderName,
      refIds: {},
    });
    await new Promise((resolve, reject) => {
      FolderModel.create(folder, async (err) => {
        if (err)
          return reject(
            await STATUS.NOT_FOUND(ctx, {
              target: await Message(ctx, "FOLDER"),
            })
          );
        Log("user", "folder cree ");
        favorites.folders.push(folder.id);
        await favorites.save();
        resolve(folder);
      });
    });
    return folder.id;
  }

  public async show(ctx: HttpContextContract) {
    const { request } = ctx;
    const id = request.params().id;
    const IdToken = request.params().token.id;
    let folder = await FolderModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
      user: IdToken,
    });
    if (!folder)
      return await STATUS.NOT_FOUND(ctx, {
        target: await Message(ctx, "FOLDER"),
      });
    return folder;
  }

  public async update(ctx: HttpContextContract) {
   const  { request } = ctx;
    const info = (request.body().info = JSON.parse(request.body().info));
    const IdToken = request.params().token.id;
    let id = request.params().id;
    Log("folder", { IdToken, id });

    const folder = await FolderModel.findOne({
      _id: request.params().id,
      user: IdToken,
    });
    if (!folder) return await STATUS.BAD_AUTH(ctx , {target : await Message('FOLDER')});
    let changed = false;

    if (info.folderName) {
      folder.folderName = info.folderName;
      changed = true;
    }

    if (info.refID != undefined && info.model != undefined) {
      if (folder.refIds == undefined) {
        folder.refIds = {};
      }

      folder.refIds = {
        ...folder.refIds,
        [info.refID]: {
          model: info.model,
          createdDate: Date.now(),
        },
      };
      changed = true;
    }

    if (info.removeRefID) {
      delete folder.refIds[info.refID];
      changed = true;
    }

    if (changed) {
      const a = await folder.save();
      Log("folder", "saved ", a);
    }
    Log("folder", folder);
    return { status: 202 };
  }
  public async destroy(ctx: HttpContextContract) {
    const { request } = ctx;
    const IdToken = request.params().token.id;
    Log("folder", request.body().folderId);
    await FolderModel.findOneAndRemove(
      {
        _id: request.body().folderId,
        user: IdToken,
      },
      async (err: Error) => {
        if (err)
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "FOLDER"),
          });
        return await STATUS.DELETED(ctx, {
          target: await Message(ctx, "FOLDER"),
        });
      }
    ).clone();
  }
}
