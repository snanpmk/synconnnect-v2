import cors from "cors";
import config from "./env.js";

const allowedOrigins = [
  config.CLIENT_URL, // active environment URL
  "http://localhost:2000", // always allow dev
  "http://localhost:5174", // always allow dev
  "http://localhost:5173", // always allow dev
  "https://synconnect.in", // always allow prod
  "https://www.synconnect.in",
  "http://192.168.0.130:5173",
  "http://172.20.10.5:5173",
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
