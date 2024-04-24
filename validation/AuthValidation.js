import { check, validationResult } from "express-validator";
import Dokter from "../models/DokterModel.js";

export const Register = [
    check('str').isLength({ min: 1 }).withMessage('tidak boleh kosong'),
    check('password').isLength({ min: 1 }).withMessage('tidak boleh kosong'),
    check('username').isLength({ min: 1 }).withMessage('tidak boleh kosong')
    .custom(async (username, { req }) => {
        const existingDokter = await Dokter.findOne({
            where: { username }
        });
        if (existingDokter) {
            throw new Error('user sudah terdaftar');
        }
    }),
    check('conf_password').custom(async (confPassword, { req }) => {
        const { password } = req.body;
        if (password !== await confPassword) {
            throw new Error('password dan confirmation password tidak cocok');
        }
    })
    
];

export const Login = [
    check('username').isLength({ min: 1 }).withMessage('tidak boleh kosong'),
    check('password').isLength({ min: 1 }).withMessage('tidak boleh kosong'),
]