import express from "express";
import {register, login, logout} from "../controllers/AuthParent.js"
import { refreshTokenParent } from "../controllers/RefreshToken.js";
import { Register, Login } from "../validation/AuthParentValidation.js";

const router = express.Router();

router.post('/parent/register', Register, register)
router.post('/parent/login', Login, login)
router.get('/parent/token', refreshTokenParent)
router.delete('/parent/logout', logout)

export default router;