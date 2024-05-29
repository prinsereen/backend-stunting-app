import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllPatients, createPatient, updatePatient, deletePatient, getPatientById } from "../controllers/Pasien.js";

const router = express.Router();

router.post('/pasien', verifyToken, createPatient)
router.patch('/pasien/:id', verifyToken, updatePatient)
router.get('/pasien', verifyToken, getAllPatients)
router.get('/pasien/:id', verifyToken, getPatientById)
router.delete('/pasien/:id', verifyToken, deletePatient)

export default router;