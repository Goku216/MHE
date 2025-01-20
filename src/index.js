import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { sequelize } from "./db/db.js";
import { userRouter } from "./routes/userRoutes/userRoutes.js";
import { adminRouter } from "./routes/adminRoutes/adminRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies if needed
  })
);

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
