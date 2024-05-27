import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import KelompokUsia from "./DataMasterKelompokUsia.js";

const {DataTypes} = Sequelize;

const Kuesioner = db.define('master_kuesioners', {
    kelompok_usia_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableName: true
})

Kuesioner.belongsTo(KelompokUsia, {foreignKey: 'kelompok_usia_id'});

export default Kuesioner;