import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from synconnnect-v2/.env (one level up)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Export all environment variables
export default {
  MONGO_URI: process.env.MONGO_URI,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
};
