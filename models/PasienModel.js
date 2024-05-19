import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Pasien = db.define('pasiens', {
    nik:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },   
    nama:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },   
    alamat:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },   
    tanggal_lahir:{
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },   
    nama_ayah:{
        type: DataTypes.STRING,
        allowNull: true
    },   
    nama_ibu:{
        type: DataTypes.STRING,
        allowNull: true
    },   
    jenis_kelamin:{
        type: DataTypes.ENUM("L", "P"),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    freezeTableName: true
})

export default Pasien;