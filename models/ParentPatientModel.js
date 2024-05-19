import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";
import Parent from "./ParentModel.js";

const {DataTypes} = Sequelize;

const ParentPatient = db.define('parentpatients', {
    parent_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },   
    patient_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableName: true
})

ParentPatient.belongsTo(Pasien, {foreignKey: 'patient_id'});
ParentPatient.belongsTo(Parent, {foreignKey: 'parent_id'});

export default ParentPatient;