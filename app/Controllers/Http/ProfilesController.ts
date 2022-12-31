import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "sublymus_logger";
import ProfileModel from "../../Model/ProfileModel";

export default class ProfilesController {
  public async index({}: HttpContextContract) {}

  //  public async create({}: HttpContextContract) {}

  public async store({request }: HttpContextContract) {

    const info = request.body().info;

    const profile = new ProfileModel({
      message: info.profile_message,
      imgProfile: request.file("img-profile")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
      banner: request.file("banner")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
      updatedDate: Date.now()
    });

    await new Promise((resolve, reject) => {
      ProfileModel.create(profile, (err) => {
        if (err) return reject({ err: "error", message: err.message });
        Log("user", "profile cree ");
        resolve(profile);
      });
    });

    return profile.id;
  }

  public async show({}: HttpContextContract) {}

  //  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
