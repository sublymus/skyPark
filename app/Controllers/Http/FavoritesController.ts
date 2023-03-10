import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Message from "../../Exceptions/Message";
import STATUS from "../../Exceptions/STATUS";
import ERROR from "../../Exceptions/STATUS";
import FavoritesModel from "../../Model/FavoritesModel";
import FoldersController from "./FoldersController";

export default class FavoritesController {
  public async store(ctx: HttpContextContract) {
    const {info }= ctx;

    info.folderName = "mes préférences";
    const favorites = new FavoritesModel({
      user: info.userId,
      folders: [],
    });
    await new Promise((resolve, reject) => {
      FavoritesModel.create(favorites, async (err) => {
        if (err) return reject( await STATUS.NOT_CREATED(ctx , { target : await Message(ctx ,'FAVORITES') , detail : err.message}));
        resolve(favorites);
        info.savedlist.push({id : favorites._id ,idName : "favoritesId" ,controller : FavoritesController})
      });
    });

    info.favoritesId = favorites.id;
    await new FoldersController().store(ctx);
    return favorites.id;
  }

  public async show(ctx: HttpContextContract) {
    const { request } = ctx;
    const tokenId = request.params().token.id;
    const id = request.params().id;
    let favorites = await FavoritesModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
      user: tokenId,
    });

    if (!favorites) {
      return await ERROR.BAD_AUTH(ctx, {
        target: await Message(ctx, "UNAUTHORIZED"),
      });
    }
    await favorites.populate({
      path: "folders",
      model: "folder",
      select: "-refIds -__v",
    });
    return favorites;
  }
  public async destroy(ctx: HttpContextContract) {
    const { request ,info } = ctx;
    const IdToken = request.params().token.id;
    let id = info.favoritesId;
    let favorites = await FavoritesModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
      user: IdToken,
    });

    if (!favorites)
      return await ERROR.NOT_FOUND(ctx, {
        target: await Message(ctx, "FAVORITES"),
      });
    favorites.folders.forEach(async (folderId) => {
      info.folderId = folderId;
      await new FoldersController().destroy(ctx);
    });

    return await favorites.remove();
  }
}
