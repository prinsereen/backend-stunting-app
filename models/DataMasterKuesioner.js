import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import TipeTes from "./DataMasterTipeTes.js";
import KelompokUsia from "./DataMasterKelompokUsia.js";

const {DataTypes} = Sequelize;

const Kuesioner = db.define('master_kuesioners', {
    kelompok_usia_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    tipe_tes_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }   
}, {
    freezeTableName: true
})

Kuesioner.belongsTo(TipeTes, {foreignKey: 'tipe_tes_id'});
Kuesioner.belongsTo(KelompokUsia, {foreignKey: 'kelompok_usia_id'});

export default Kuesioner;