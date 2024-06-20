import { connect } from "mongoose";
import configObject from "./config/envConfig.js";

class DataBase {
  static #instance;
  constructor() {
    connect(configObject.server.mongo_url);
  }
  static getInstance() {
    try {
      if (this.#instance) return this.#instance;
      this.#instance = new DataBase();
      console.log("Connection MongoDB success");
    } catch (err) {
      console.error(err);
    }
  }
}

export default DataBase.getInstance();
