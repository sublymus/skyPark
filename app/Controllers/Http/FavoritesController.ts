import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import Message from "../../Exceptions/Message";
import ERROR from "../../Exceptions/STATUS";
import FavoritesModel from "../../Model/FavoritesModel";
import FoldersController from "./FoldersController";

export default class FavoritesController {
  public async store(ctx: HttpContextContract) {
    const info = ctx.request.body().info;

    info.folderName = "mes préférences";
    Log("user", "info : ", info);

    const favorites = new FavoritesModel({
      user: info.userId,
      folders: [],
    });
    await new Promise((resolve, reject) => {
      FavoritesModel.create(favorites, (err) => {
        if (err) return reject(err);
        Log("user", "favorites cree ");
        resolve(favorites);
      });
    });

    info.favoritesID = favorites.id;
    await new FoldersController().store(ctx);

    return favorites.id;
  }

  public async show(ctx: HttpContextContract) {
    const { request } = ctx;
    const IdToken = request.params().token.id;
    const id = request.params().id;

    // Log("favorites", "token", IdToken);
    let favorites = await FavoritesModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
      user: IdToken,
    });

    Log("acsess", { IdToken, favorites });

    if (!favorites) {
      Log("!favorites", { favorites });
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
    const { request } = ctx;
    const IdToken = request.params().token.id;
    let id = request.body().favoritesId || request.param("id");
    let favorites = await FavoritesModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
      user: IdToken,
    });

    if (!favorites)
      return await ERROR.NOT_FOUND(ctx, {
        target: await Message(ctx, "FAVORITES"),
      });
    Log("favorites", request.body().favoritesId);

    favorites.folders.forEach(async (folderId) => {
      request.body().folderId = folderId;
      await new FoldersController().destroy(ctx);
    });

    return await favorites.remove();
  }
}
