import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";
configDotenv();
export const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_URI);
