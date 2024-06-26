import Pasien from "../models/PasienModel.js";
import {success, error} from "../lib/Responser.js"
import TransactionPertumbuhan from "../models/TranscationModelPertumbuhan.js";
import TransactionKPSP from "../models/TransactionModelKPSP.js"

// Get all patients
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Pasien.findAll({
            attributes:["id","nama", "alamat"]
        });
        return success(res, "Berhasil mendapatkan data semua pasien", patients);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Get a patient by ID
export const getPatientById = async (req, res) => {
    try {
        const { id } = req.params; // Patient ID
        const patient = await Pasien.findByPk(id, {
            attributes: ["nik", "nama", "alamat", "tanggal_lahir", "nama_ayah", "nama_ibu", "jenis_kelamin", "no_hp", "rt", "rw"]
        });
        if (!patient) {
            return res.status(404).json({ msg: "Pasien tidak ditemukan" });
        }
        return success(res, "Berhasil mendapatkan data pasien", patient);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


// Create a new patient
export const createPatient = async (req, res) => {
    try {
        const { nik, nama, alamat, tanggal_lahir, nama_ayah, nama_ibu, jenis_kelamin, no_hp, rt, rw } = req.body;
        const pasien = await Pasien.findOne({
            where: {
                nik
            }
        })
        if (!pasien){
            const newPatient = await Pasien.create({
                nik,
                nama,
                alamat,
                tanggal_lahir,
                nama_ayah,
                nama_ibu,
                jenis_kelamin,
                no_hp,
                rt,
                rw
            })
            return success(res, "Berhasil membuat pasien baru", newPatient);
        }
        return error(res, "sudah terdaftar", {})
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Update a patient
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params; // Patient ID
        const { nama, alamat, tanggal_lahir, nama_ayah, nama_ibu, jenis_kelamin } = req.body;
        const updatedPatient = await Pasien.findByPk(id);
        if (!updatedPatient) {
            return res.status(404).json({ msg: "Pasien tidak ditemukan" });
        }
        const updatePatient = await updatedPatient.update({
            nama,
            alamat,
            tanggal_lahir,
            nama_ayah,
            nama_ibu,
            jenis_kelamin
        })
        return success(res, "Berhasil memperbarui data pasien", updatePatient);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Delete a patient
export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params; // Patient ID
        const deletedPatient = await Pasien.findByPk(id);
        if (!deletedPatient) {
            return res.status(404).json({ msg: "Pasien tidak ditemukan" });
        }

        // Delete related records in transaction_pertumbuhan
        await TransactionPertumbuhan.destroy({
            where: {
                pasien_id: id
            }
        });

        await TransactionKPSP.destroy({
            where: {
                pasien_id: id
            }
        });

        // Delete the patient
        await deletedPatient.destroy();
        return success(res, "Berhasil menghapus data pasien");
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
