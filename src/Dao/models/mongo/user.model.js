import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    surName: {
      type: String,
    },
    email: {
      type: String,
      index: true,
      unique: true,
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
    },
    roles: { type: String, enum: ["admin", "user"], default: "user" },
    cart: [{ ref: "carts", type: Schema.Types.ObjectId }],
  },
  { timestamps: true, versionKey: false }
);

export default model("user", userSchema);;
