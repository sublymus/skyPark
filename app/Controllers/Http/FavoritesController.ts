import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "sublymus_logger";
import FavoritesModel from "../../Model/FavoritesModel";
import FoldersController from "./FoldersController";

export default class FavoritesController {
  public async index({}: HttpContextContract) {}

  //public async create({}: HttpContextContract) {}

  public async store(ctx: HttpContextContract) {
  const info = ctx.request.body().info;
  
  info.folderName = "mes préférences";
  Log('user', 'info : ',info);

   const folderID = await new FoldersController().store(ctx);
    const favorites = new FavoritesModel({
      folder: [folderID],
    });
    await new Promise((resolve, reject) => {
      FavoritesModel.create(favorites, (err) => {
        if (err) return reject(err);
        Log("user", "favorites cree ");
        resolve(favorites);
        // reject({ err: "error", message: err.message });
      });
    });
    return favorites.id;
  }

  public async show({}: HttpContextContract) {}

  // public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
