import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getKuesioner, postSoalItem, resultKPSP } from "../controllers/KPSP.js";
import { calculatePertumbuhan } from "../controllers/ResultPertumbuhan.js";
import { getAllResult } from "../controllers/ResultPertumbuhan.js";

const router = express.Router();

router.post('/kpsp/:id', verifyToken, postSoalItem)
router.patch('/kpsp/result/:id', verifyToken, resultKPSP)
router.post('/kpsp/result/pertumbuhan/:id', verifyToken, calculatePertumbuhan)
router.get('/kpsp/:id', verifyToken, getKuesioner)
router.get('/result/:id', verifyToken, getAllResult)

export default router;