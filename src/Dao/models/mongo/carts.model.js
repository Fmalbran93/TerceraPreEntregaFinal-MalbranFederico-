import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

  },
});

export const cartsModel = model("carts", cartSchema);
