import { Schema, model } from "mongoose"

const ordersSchema = new Schema({
   
    order: {
        type: String,
        required: true,
        unique: true
    },
    total: {
        type: String,
        required: true
    },
    userMail: {
        type: Types.ObjectId,
        ref: 'user', // Referencia al modelo "user"
        required: true
    }

}, { timestamps: true, versionKey: false }
);

export default model("order", ordersSchema);