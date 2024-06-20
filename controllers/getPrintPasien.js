import Pasien from "../models/PasienModel.js";
import TransactionPertumbuhan from "../models/TranscationModelPertumbuhan.js";
import { hitungUsiaDalamBulan } from "./KPSP.js";
import { showFormattedDate } from "./ResultPertumbuhan.js";

export const getPrintPatient = async (req, res) => {
    try {
        // Dapatkan semua pasien terlebih dahulu
        const pasiens = await Pasien.findAll();
        const results = [];

        // Iterasi melalui setiap pasien
        for (const pasien of pasiens) {
            // Hitung umur dalam bulan
            const umurDalamBulan = hitungUsiaDalamBulan(pasien.tanggal_lahir);
            // Dapatkan transaksi yang sesuai dengan umur dalam bulan ini
            const transaksi = await TransactionPertumbuhan.findOne({
                where: {
                    pasien_id: pasien.id, // Sesuaikan dengan hubungan antara pasien dan transaksi
                    umur: umurDalamBulan
                }
            });
            // Jika transaksi ditemukan, tambahkan ke hasil
            if (transaksi) {
                results.push({
                    nik: pasien.nik,
                    nama: pasien.nama,
                    alamat: pasien.alamat,
                    tanggal_lahir: showFormattedDate(pasien.tanggal_lahir),
                    nama_ayah: pasien.nama_ayah,
                    nama_ibu: pasien.nama_ibu,
                    no_hp: pasien.no_hp,
                    rt: pasien.rt,
                    rw: pasien.rw,
                    jenis_kelamin: pasien.jenis_kelamin,
                    panjang: transaksi.panjang,
                    berat_badan: transaksi.berat_badan,
                    lingkar_kepala: transaksi.lingkar_kepala,
                    umur_dalam_bulan: transaksi.umur,
                    hasil_BMI: transaksi.hasil_BMI,
                    hasil_HCFA: transaksi.hasil_HCFA,
                    hasil_LFA: transaksi.hasil_LFA,
                    hasil_WFL: transaksi.hasil_WFL
                });
            }
        }
        // Kirimkan hasil sebagai respons
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan" });
    }
};
