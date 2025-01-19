import { configDotenv } from "dotenv";
import express from "express";
// import { sequalize } from "./db/db";
configDotenv()
const app = new express()
const port = 3000 || process.env.PORT
// await sequalize.authenticate().then(()=>console.log("Database connection established...")).catch((err)=>console.log("Failed to connect to database ",err))
app.listen(port, async () => {
console.log(`Server is listening on port ${port}`);
})