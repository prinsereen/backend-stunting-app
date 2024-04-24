import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import Kuesioner from "./DataMasterKuesioner.js";

const {DataTypes} = Sequelize;

const Result = db.define('results', {
    pasien_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    kuesioner_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    attempt:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    hasil:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    freezeTableName: true
})

Result.belongsTo(Pasien, {foreignKey: 'pasien_id'})
Result.belongsTo(Kuesioner, {foreignKey: 'kuesioner_id'})

export default Result;