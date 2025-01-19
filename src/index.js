import { configDotenv } from "dotenv";
import express from "express";
configDotenv()
const app=new express()
const port=3000 || process.env.PORT

app.listen(port,async()=>{
    console.log(`Server is listening on port ${port}`);
})