import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";


let folderSchema = new Schema({
  refIds : {
    type: Object,
    required: true
  } ,
  folderName : {
    type : String,
    required : true
  },
  createdDate: Number

});

folderSchema.add(mongoose_unique_validation);

const FolderModel = mongoose.model("folder", folderSchema);

export default FolderModel;
