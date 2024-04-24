import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import Kuesioner from "./DataMasterKuesioner.js";

const {DataTypes} = Sequelize;

const Transaction = db.define('transaction', {
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
    jawaban:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableName: true
})

Transaction.belongsTo(Pasien, {foreignKey: 'pasien_id'})
Transaction.belongsTo(Kuesioner, {foreignKey: 'kuesioner_id'})

export default Transaction;