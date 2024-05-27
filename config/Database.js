import {Sequelize} from "sequelize";

const db = new Sequelize('db_ium', 'root', '', {
    host: "localhost",
    dialect: "mysql",
})

export default db;