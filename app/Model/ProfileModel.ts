import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";

let profileSchema = new Schema({
  imgProfile: {
    type : String,
    required : true
  },
  banner: {
    type : String,
    required : true
  },
  message: String,
});

profileSchema.add(mongoose_unique_validation);

const ProfileModel = mongoose.model("profile", profileSchema);

export default ProfileModel;
