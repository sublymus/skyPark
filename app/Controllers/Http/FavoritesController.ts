import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import FavoritesModel from "../../Model/FavoritesModel";
import FoldersController from "./FoldersController";

export default class FavoritesController {
  public async index({}: HttpContextContract) {}

  //public async create({}: HttpContextContract) {}

  public async store(ctx: HttpContextContract) {
    const info = ctx.request.body().info;

    info.folderName = "mes préférences";
    Log("user", "info : ", info);

    const favorites = new FavoritesModel({
      folders: [],
    });
    await new Promise((resolve, reject) => {
      FavoritesModel.create(favorites, (err) => {
        if (err) return reject(err);
        Log("user", "favorites cree ");
        resolve(favorites);
        // reject({ err: "error", message: err.message });
      });
    });

    info.favoritesID = favorites.id
    await new FoldersController().store(ctx);

    return favorites.id;
  }

  public async show({ request }: HttpContextContract) {
    Log("favorites", "show");
    const id = request.params().id;

    Log("favorites", "show", id);

    let favorites = await FavoritesModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
    });
    if (!favorites) return { status: 404, message: "favorite(s) don't exist" };
    await favorites.populate({
      path: "folders",
      model: "folder",
      select : "-refIds -__v"
    });

    return favorites;
  }

  // public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
