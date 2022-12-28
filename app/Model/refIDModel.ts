import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";

let refIDSchema = new Schema({
  targetID : Schema.Types.ObjectId,
  model : String
});

refIDSchema.add(mongoose_unique_validation);

const refIDModel= mongoose.model("refid", refIDSchema);

export default refIDModel;
