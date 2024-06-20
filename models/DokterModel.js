import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Dokter = db.define('dokters', {
    str:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },   
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
})

export default Dokter;