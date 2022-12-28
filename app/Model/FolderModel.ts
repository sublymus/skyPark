import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";
import refIDModel from "./refIDModel";

let folderSchema = new Schema({
  refID : {
    type : [{
        type : Schema.Types.ObjectId,
        refPath : refIDModel.modelName
      }]
  },
  name : String
});

folderSchema.add(mongoose_unique_validation);

const FolderModel = mongoose.model("folder", folderSchema);

export default FolderModel;
