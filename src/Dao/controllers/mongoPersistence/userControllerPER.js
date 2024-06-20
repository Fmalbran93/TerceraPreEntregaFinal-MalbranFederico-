import userModel from "../models/mongo/user.model.js";

class Users {

  getUser = async (req, res) => {
    try {
      const user = await userModel.find({});
      return res.status(200).json({
        success: true,
        user: user
      });
    } catch (err) {
      console.error(err);
    }
  };

  async getUserById(req, res) {
    try {
      const { uid } = req.params;
      const userFind = await userModel.findById(uid);
      res.status(200).json({
        success: "success",
        user: userFind,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async updateUser(req, res) {
    try {
      const { uid } = req.params;
      await userModel.findByIdAndUpdate(uid, req.body);
      return res.status(200).json({
        message: "Usuario actualizado",
      });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUser(req, res) {
    try {
      const { uid } = req.params;
      await userModel.findByIdAndDelete(uid);
      res.status(200).json({
        message: "Usuario Eliminado",
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export default Users;
