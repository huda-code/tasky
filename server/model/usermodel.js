import mongoose from "mongoose";
import taskModel from "./taskmodel.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    password2: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // tasks: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "userModel"
    // }]
  
});

const userModel = new mongoose.model("User", userSchema, "Users");

export default userModel;