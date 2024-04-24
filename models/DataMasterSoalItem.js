import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Kuesioner from "./DataMasterKuesioner.js";

const {DataTypes} = Sequelize;

const SoalItem = db.define('master_soal_item', {
    kuesioner_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    pertanyaan:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: true
    }, 
    foto_url:{
        type: DataTypes.STRING,
        allowNull: true
    }, 
}, {
    freezeTableName: true
})

SoalItem.belongsTo(Kuesioner, {foreignKey: 'kuesioner_id'});

export default SoalItem;