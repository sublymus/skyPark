import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";

let profileSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
  },
  imgProfile: {
    type : String,
    required : true
  },
  banner: {
    type : String,
    required : true
  },
  message: String,
  updatedDate: Number

});

profileSchema.add(mongoose_unique_validation);

const ProfileModel = mongoose.model("profile", profileSchema);

export default ProfileModel;
