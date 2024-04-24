import jwt from "jsonwebtoken";
import Dokter from "../models/DokterModel.js";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Dokter.findOne({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);

            const id = user.id;
            const str = user.str;
            const username = user.username;

        const accessToken = jwt.sign({id, str, username}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
            res.json({accessToken})
        })
    } catch (error) {
        console.log(error)
    }
}