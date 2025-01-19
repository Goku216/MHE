import { configDotenv } from "dotenv";
import express from "express";
import { sequelize } from "./db/db.js";  // Correct spelling
configDotenv();

const app = express();  // No need for `new`
const port = process.env.PORT || 3000;  // Correct port assignment

try {
  await sequelize.authenticate();
  console.log("Database connection established...");
} catch (err) {
  console.log("Failed to connect to database", err);
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
