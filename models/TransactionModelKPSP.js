import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import Kuesioner from "./DataMasterKuesioner.js";
import SoalItem from "./DataMasterSoalItem.js";

const {DataTypes} = Sequelize;

const TransactionKPSP = db.define('transaction_kpsp', {
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
    soal_item_id:{
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
    value:{
        type: DataTypes.ENUM("Y", "N"),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableName: true
})

TransactionKPSP.belongsTo(Pasien, {foreignKey: 'pasien_id'})
TransactionKPSP.belongsTo(Kuesioner, {foreignKey: 'kuesioner_id'})
TransactionKPSP.belongsTo(SoalItem, {foreignKey: 'soal_item_id'})

export default TransactionKPSP;