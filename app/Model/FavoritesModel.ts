import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";
import FolderModel from "./FolderModel";

let favoritesSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
  },
  folders : {
    type : [{
        type : Schema.Types.ObjectId,
        refPath : FolderModel.modelName
      }]
  }
});

favoritesSchema.add(mongoose_unique_validation);

const FavoritesModel = mongoose.model("favorites", favoritesSchema);

export default FavoritesModel;
