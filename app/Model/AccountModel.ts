import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";
import AdressModel from "./AdressModel";
import FavoritesModel from "./FavoritesModel";
import ProfileModel from "./ProfileModel";

let accountSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: [3, "trop court"],
    maxlength: [20, "trop long"],
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  adress: {
    type:Schema.Types.ObjectId,
    ref :AdressModel.modelName
  },
  favorites: {
    type:Schema.Types.ObjectId,
    ref : FavoritesModel.modelName
  },
  profile: {
    type:Schema.Types.ObjectId,
    ref : ProfileModel.modelName
  },
  createdDate: Number,
  updatedDate: Number
});

accountSchema.add(mongoose_unique_validation);

const AccountModel = mongoose.model("account", accountSchema);

export default AccountModel;
