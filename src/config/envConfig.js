import dotenv from "dotenv";
import program from "./commander.js";

const { mode } = program.opts();

dotenv.config({
  path: mode === "dev" ? "./.env.dev" : "./.env.build",
});

const configObject = {
  server: {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT,
    secret: process.env.SESSION_SECRET,
    persistence: process.env.PERSISTENCE || "PERSISTENCE_MONGO",
  },
  auth_github: {
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_secret_client: process.env.GITHUB_SECRET_CLIENT,
    github_callback: process.env.GITHUB_CALLBACK_URI,
  },
  auth_google: {
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_secret_client: process.env.GOOGLE_CLIENT_SECRET,
    google_callback: process.env.CALLBACK_GOOGLE_URI,
  },
};

export default configObject;
