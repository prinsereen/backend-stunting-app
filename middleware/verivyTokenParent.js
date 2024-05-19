import jwt from "jsonwebtoken"

export const verifyTokenParent = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_PARENT, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        console.log(decoded)
        req.user = {
            id: decoded.id,
            username: decoded.username,
        };
        console.log(req.user)
        next();
    });
};
