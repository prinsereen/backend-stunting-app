import { check, validationResult } from "express-validator";
import Parent from "../models/ParentModel.js";

export const Register = [
    check('password').isLength({ min: 1 }).withMessage('tidak boleh kosong'),
    check('username').isLength({ min: 1 }).withMessage('tidak boleh kosong')
    .custom(async (username, { req }) => {
        const existingParent = await Parent.findOne({
            where: { username }
        });
        if (existingParent) {
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