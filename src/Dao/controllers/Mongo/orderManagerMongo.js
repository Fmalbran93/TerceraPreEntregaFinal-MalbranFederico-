import orderModel from "../../models/mongo/orders.model.js";
import { v4 as uuidv4 } from "uuid";

class Orders {

    addOrder = async (req, res) => {
        try {
          const order = uuidv4();
          const total = 56;
          let newOrder = new orderModel({
            order,
            total,
          });
          await newOrder.save();
          console.log(`el numero de la orden de compra es:  #${order}`);
        } catch (err) {
          console.error(err);
        }
      };

    getOrders = async () => {
        try {
            return await orderModel.find();
        } catch (err) {
            console.error(err)
        }
    };

    async getOrderById(id) {
        try {
            return await orderModel.findById(id);
        } catch (err) {
            console.error(err);
        }
    };

    async updateOrder(id, order) {
        try {
            return await orderModel.findByIdAndUpdate(id,
                { $set: order }
            );
        } catch (err) {
            console.error(err);
        }
    };

    async deleteOrder(id) {
        try {
            return await orderModel.findByIdAndDelete(id);
        } catch (err) {
            console.error(err);
        }
    };
};

export default Orders;