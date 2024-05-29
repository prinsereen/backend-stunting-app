import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";

const {DataTypes} = Sequelize;

const TransactionPertumbuhan = db.define('transaction_pertumbuhan', {
    pasien_id:{
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
    panjang:{
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    berat_badan:{
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    lingkar_kepala:{
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    hasil_BMI:{
        type: DataTypes.STRING,
    },
    umur:{
        type: DataTypes.STRING,
    },
    hasil_HCFA:{
        type: DataTypes.STRING,
    },
    hasil_LFA:{
        type: DataTypes.STRING,
    },
    hasil_WFL:{
        type: DataTypes.STRING,
    },
    hasil_KPSP:{
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true
})

TransactionPertumbuhan.belongsTo(Pasien, {foreignKey: 'pasien_id'})
// TransactionPertumbuhan.belongsTo(Kuesioner, {foreignKey: 'kuesioner_id'})

export default TransactionPertumbuhan;