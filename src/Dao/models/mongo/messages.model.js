import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    user: String,
    message: String,
  },
  { timestamps: true }
);

export default model("messages", schema);;
