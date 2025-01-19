import { Sequelize } from "sequelize";

export const sequalize=new Sequelize('database','username','password',{
    host:"localhost",
    dialect:'mysql',
    logging:false
})