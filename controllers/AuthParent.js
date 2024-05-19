import Parent from "../models/ParentModel.js";
import {success, error} from "../lib/Responser.js"
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";
import { check, validationResult } from "express-validator";

export const register = async(req, res) => {
    const { username, password, conf_password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return error(res,  errors["errors"][0].path + " " + errors["errors"][0].msg, errors["errors"])
    }

    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newParent = await Parent.create({
            username,
            password: hashPassword
        });
        
        return success(res, "Berhasil Register", newParent);
        
    } catch (error) {
        console.log(error)
    }
}

export const login = async(req, res) => {
    try {

        const {username, password} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return error(res,  errors["errors"][0].path + " " + errors["errors"][0].msg, errors["errors"])
        }

        const user = await Parent.findOne({
            where:{
                username
            }
        })

        const match = await bcrypt.compare(password, user.password);
        if(!match) return error(res, "Wrong Password")

        const id = user.id;

        const accessToken = jwt.sign({id,  username}, process.env.ACCESS_TOKEN_SECRET_PARENT, {
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({id,  username}, process.env.REFRESH_TOKEN_SECRET_PARENT, {
            expiresIn: '1d'
        });
        await Parent.update({refresh_token: refreshToken}, {
            where: {
                username
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24*60*1000
        });
        res.json({accessToken})
    } catch (error) {
        console.log(error)
        res.status(404).json({msg: "User Tidak Ditemukan"})
    }
}

export const logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Parent.findOne({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user) return res.sendStatus(204);
    const username = user.username;
    await Parent.update({refresh_token: null},{
        where:{
            username
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200)
}