// server/config/env.config.js

import dotenv from "dotenv";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent folder
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
// define environments
const ENV = process.env.NODE_ENV || "development";

const CONFIG = {
  development: {
    CLIENT_URL: "http://localhost:2000",
    MONGO_URI: process.env.MONGO_URI_DEV,
    PORT: process.env.PORT || 5000,
  },
  production: {
    CLIENT_URL: "https://synconnect.in",
    MONGO_URI: process.env.MONGO_URI_PROD,
    PORT: process.env.PORT || 5000,
  },
};

// export current environment’s config
export default CONFIG[ENV];
