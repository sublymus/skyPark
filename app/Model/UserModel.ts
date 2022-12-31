import mongoose, { Schema } from "mongoose";
import mongoose_unique_validation from "mongoose-unique-validation";
import Log from "sublymus_logger";
import AccountModel from "./AccountModel";

let userSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: AccountModel.modelName,
  },
});
Log("usercontroller", AccountModel.modelName);
userSchema.add(mongoose_unique_validation);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
