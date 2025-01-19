import dotenv from 'dotenv';  
import express from 'express';
import { sequelize } from './db/db.js';  
import { userRouter } from './routes/userRoutes/userRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', userRouter);  // Mount user routes at /api

// Database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();  
    console.log("Database connection established...");
  } catch (err) {
    console.error("Failed to connect to database", err);
  }
};

initializeDatabase();  

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
