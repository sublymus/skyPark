import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";

let adressSchema = new Schema({
  location: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  home:{
    type: String,
    required: true,
  },
  description: String,
});

adressSchema.add(mongoose_unique_validation);

const AdressModel = mongoose.model("adress", adressSchema);

export default AdressModel;
