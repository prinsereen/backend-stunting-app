import {Sequelize} from "sequelize";

const db = new Sequelize('stunting_db', 'root', '', {
    host: "localhost",
    dialect: "mysql",
})

export default db;