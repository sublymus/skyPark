import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";

type a = {
  [k: string]: {
    model : string,
  }
}
const A: a = {

}

let folderSchema = new Schema({
  refIds : {
    type: Object,
    required: true
  } ,
  folderName : {
    type : String,
    required : true
  }
});

folderSchema.add(mongoose_unique_validation);

const FolderModel = mongoose.model("folder", folderSchema);

export default FolderModel;
