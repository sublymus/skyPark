import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Log from 'sublymus_logger';
import FolderModel from '../../Model/FolderModel';

export default class FoldersController {
  public async index({}: HttpContextContract) {}

//  public async create({}: HttpContextContract) {}

  public async store({request}: HttpContextContract) {
        
    const info = request.body().info = JSON.parse(request.body().info);
Log('user', info)
    const folder = new FolderModel({
      name: info.folderName,
      refID: [],
    });
    await new Promise((resolve, reject) => {
      FolderModel.create(folder, (err) => {
        if (err) return reject({  err});
        Log("user", "folder cree ");
        resolve(folder);
        // reject({ err: "error", message: err.message });
      });
    });
    return folder.id;

  }

  public async show({}: HttpContextContract) {}

//  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
