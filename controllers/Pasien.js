import Pasien from "../models/PasienModel.js";
import {success, error} from "../lib/Responser.js"

// Get all patients
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Pasien.findAll();
        return success(res, "Berhasil mendapatkan data semua pasien", patients);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Create a new patient
export const createPatient = async (req, res) => {
    try {
        const { nama, alamat, tanggal_lahir, nama_ayah, nama_ibu, jenis_kelamin } = req.body;
        const newPatient = await Pasien.create({
            nama,
            alamat,
            tanggal_lahir,
            nama_ayah,
            nama_ibu,
            jenis_kelamin
        })
        return success(res, "Berhasil membuat pasien baru", newPatient);
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
        updatedPatient.nama = nama;
        updatedPatient.alamat = alamat;
        updatedPatient.tanggal_lahir = tanggal_lahir;
        updatedPatient.nama_ayah = nama_ayah;
        updatedPatient.nama_ibu = nama_ibu;
        updatedPatient.jenis_kelamin = jenis_kelamin;
        await updatedPatient.save();
        return success(res, "Berhasil memperbarui data pasien", updatedPatient);
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
        await deletedPatient.destroy();
        return success(res, "Berhasil menghapus data pasien");
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
