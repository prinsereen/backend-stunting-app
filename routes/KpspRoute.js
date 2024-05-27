import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getKuesioner, postSoalItem, resultKPSP } from "../controllers/KPSP.js";

const router = express.Router();

router.post('/kpsp/:id', verifyToken, postSoalItem)
router.post('/kpsp/result/:id', verifyToken, resultKPSP)
/* router.patch('/pasien/:id', verifyToken, updatePatient) */
router.get('/kpsp/:id', verifyToken, getKuesioner)
// router.delete('/pasien/:id', verifyToken, deletePatient)

export default router;