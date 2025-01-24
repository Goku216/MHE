import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { sequelize } from "./db/db.js";
import { userRouter } from "./routes/userRoutes/userRoutes.js";
import { adminRouter } from "./routes/adminRoutes/adminRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5174", // Add localhost for development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add all the HTTP methods you expect
    allowedHeaders: ["Content-Type", "Authorization"], // Add any headers that your client is sending
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use("/api", userRouter); // Mount user routes at /api
app.use("/api", adminRouter);

// Database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established...");
    await sequelize.sync({ force: false, logging: false });
  } catch (err) {
    console.error("Failed to connect to database", err);
  }
};

initializeDatabase();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
