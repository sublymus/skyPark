import mongoose, { Schema } from "mongoose";

let adressSchema = new Schema({
  location: {
    type: String,
    trim: true,
    required: true,
  },
  home:{
    type: String,
    required: true,
  },
  description: String,
  updatedDate: Number
});


const AdressModel = mongoose.model("adress", adressSchema);

export default AdressModel;
