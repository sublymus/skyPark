import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import FavoritesModel from "../../Model/FavoritesModel";
import FolderModel from "../../Model/FolderModel";
import UserModel from "../../Model/UserModel";

export default class FoldersController {
  public async store(ctx: HttpContextContract) {
    const { info, params } = ctx;
    let tokenId = params?.token?.id;
    Log("folder", { tokenId, info, params });

    const userId = tokenId ? tokenId : info.userId;
    let favoritesId;
    if (tokenId) {
      const user: any = await UserModel.findOne(
        {
          _id: userId,
        },
        {},
        { populate: "account" }
      );
      if (!user)
        return await STATUS.NOT_FOUND(ctx, {
          target: await Message(ctx, "USER"),
        });
      info.userId = user._id;
      favoritesId = user.account.favorites;
    } else {
      favoritesId = info.favoritesId;
    }

    const favorites = await FavoritesModel.findOne({
      _id: favoritesId,
    });

    if (!favorites)
      return await STATUS.NOT_FOUND(ctx, {
        target: await Message(ctx, "FAVORITES"),
      });
    const folder = new FolderModel({
      user: userId,
      folderName: info.folderName,
      refIds: {},
    });
    await new Promise((resolve, reject) => {
      FolderModel.create(folder, async (err) => {
        if (err)
          return reject(
            await STATUS.NOT_FOUND(ctx, {
              target: await Message(ctx, "FOLDER"),
              detail: err.message,
            })
          );
        favorites.folders.push(folder.id);
        await favorites.save();
        // info.savedlist.push({id : folder._id ,idName : "folderId" ,controller : FoldersController})
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
    const { request, info } = ctx;
    const IdToken = request.params().token.id;

    const folder = await FolderModel.findOne({
      _id: request.params().id,
      user: IdToken,
    });
    if (!folder)
      return await STATUS.BAD_AUTH(ctx, {
        target: await Message(ctx, "FOLDER"),
      });
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

    if (changed) await folder.save();
    return await STATUS.UPDATE(ctx);
  }
  public async destroy(ctx: HttpContextContract) {
    const { request, info } = ctx;
    const folderId = request.param("id") ? request.param("id") : info.folderId;
    const userId = info.userId ? info.userId : request.params().token.id;
    await FolderModel.findOneAndRemove(
      {
        _id: folderId,
        user: userId,
      },
      async (err: Error) => {
        if (err)
          return await STATUS.NOT_DELETED(ctx, {
            target: await Message(ctx, "FOLDER"),
            detail: err.message,
          });
        return await STATUS.DELETED(ctx, {
          target: await Message(ctx, "FOLDER"),
        });
      }
    ).clone();
  }
}
