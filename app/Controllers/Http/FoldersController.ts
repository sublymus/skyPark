import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mongoose from "mongoose";
import Log from "sublymus_logger";
import FavoritesModel from "../../Model/FavoritesModel";
import FolderModel from "../../Model/FolderModel";

export default class FoldersController {
  public async index({}: HttpContextContract) {}

  //  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    let info : any;
    if (typeof request.body().info == "string") {
      Log("folder", " string : ", true);
      info = request.body().info = JSON.parse(request.body().info);
    } else {
      info = request.body().info;
    }
    Log("folder","favoritesId" ,info.favoritesID);
    const favorites = await FavoritesModel.findOne({
      _id: info.favoritesID,
    });

    if (!favorites) return response.status(404).send("favorites not found");

    Log("user", info);
    const folder = new FolderModel({
      folderName: info.folderName,
      refIds: {},
    });
    await new Promise((resolve, reject) => {
      FolderModel.create(folder, async (err) => {
        if (err) return reject({ err });
        Log("user", "folder cree ");
        favorites.folders.push(folder.id);
        await favorites.save();
        resolve(folder);
      });
    });
    return folder.id;
  }

  public async show({ request }: HttpContextContract) {
    const id = request.params().id;

    let folder = await FolderModel.findOne({
      _id: new mongoose.Types.ObjectId(id)._id,
    });
    if (!folder) return { status: 404, message: "folder don't exist" };
    //  await folder.populate({
    //     path: "folderName",
    //     model: "folder",
    //   });

    return folder;
  }

  //  public async edit({}: HttpContextContract) {}

  public async update({ request }: HttpContextContract) {
    const info = (request.body().info = JSON.parse(request.body().info));
    const folder = await FolderModel.findOne({
      _id: request.params().id,
    });

    if (!folder) return {};

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

  public async destroy({}: HttpContextContract) {}
}
