import cors from "cors";
import config from "./env.js";

const allowedOrigins = [
  config.CLIENT_URL, // active environment URL
  "http://localhost:2000", // always allow dev
  "https://synconnect.in", // always allow prod
  "https://www.synconnect.in",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
