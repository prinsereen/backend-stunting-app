import {success, error} from "../lib/Responser.js"
import KelompokUsia from "../models/DataMasterKelompokUsia.js";
import Kuesioner from "../models/DataMasterKuesioner.js";
import SoalItem from "../models/DataMasterSoalItem.js";
import Pasien from "../models/PasienModel.js";
import TransactionKPSP from "../models/TransactionModelKPSP.js";
import TransactionPertumbuhan from "../models/TranscationModelPertumbuhan.js";

export function hitungUsiaDalamBulan(tanggalLahir) {
    const sekarang = new Date();
    const tahunLahir = tanggalLahir.getFullYear();
    const bulanLahir = tanggalLahir.getMonth();
    const hariLahir = tanggalLahir.getDate();

    const tahunSekarang = sekarang.getFullYear();
    const bulanSekarang = sekarang.getMonth();
    const hariSekarang = sekarang.getDate();

    // Hitung selisih tahun dan bulan
    let selisihTahun = tahunSekarang - tahunLahir;
    let selisihBulan = bulanSekarang - bulanLahir;

    // Jika bulan sekarang kurang dari bulan lahir, kurangi satu tahun dari selisih tahun dan tambahkan 12 ke selisih bulan
    if (bulanSekarang < bulanLahir) {
        selisihTahun--;
        selisihBulan += 12;
    }

    // Total bulan dari selisih tahun dan bulan
    let totalBulan = selisihTahun * 12 + selisihBulan;

    // Hitung selisih hari
    const selisihHari = hariSekarang - hariLahir;
    
    // Jika hari lebih dari 15, tambahkan 1 ke total bulan
    if (selisihHari > 15) {
        totalBulan++;
    }

    return totalBulan;
}

const getRangeID =  async(umur) =>{
    let allKelompokUsia = await KelompokUsia.findAll();
    allKelompokUsia = allKelompokUsia.map(item => item.dataValues);
    const rangeUsia = allKelompokUsia.filter(item => item.usia >= umur)[0];
    const range_id = allKelompokUsia.filter(item => item.id == rangeUsia.id)
    return range_id
}


export const getKuesioner = async(req, res) => {
    try {
        const { id } = req.params;

        const pasien = await Pasien.findByPk(id);
        const { tanggal_lahir } = pasien;

        const usiaPembulatan = hitungUsiaDalamBulan(tanggal_lahir);

        const isAnswering = await KelompokUsia.findOne({
            where:{usia: usiaPembulatan}
        })

        if (!isAnswering){return success(res, "Tidak Berhak Menjawab", [])}
        
        const kpspQuestion = await SoalItem.findAll({
            where:{
                kuesioner_id: isAnswering.dataValues.id
            },
            attributes:["id", "pertanyaan", "foto_url"]
        })
        
        return success(res, "Berhasil mendapatkan soal", kpspQuestion)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const postSoalItem = async(req, res) => {
    try {
        const {id} = req.params;
        const {soal_item_id, value} = req.body; 

        const pasien = await Pasien.findByPk(id);
        const { tanggal_lahir } = pasien;

        const usiaPembulatan = hitungUsiaDalamBulan(tanggal_lahir);
        const rangeId = await getRangeID(usiaPembulatan);

        const KuesionerId = await Kuesioner.findOne({
            where:{
                kelompok_usia_id: rangeId[0].id
            }
        })

        const isAnswered = await TransactionKPSP.findOne({
            where:{
                pasien_id: id,
                kuesioner_id: KuesionerId.dataValues.id,
                soal_item_id,
                attempt: usiaPembulatan
            }
        })

        //console.log(isAnswered)

        if (!isAnswered){
            const newTransaction = await TransactionKPSP.create({
                pasien_id: id,
                kuesioner_id: KuesionerId.dataValues.id,
                soal_item_id,
                attempt: usiaPembulatan,
                value,
            })

            return success(res, "Berhasil menambahkan transaction !", newTransaction)
        }
        return error(res, "Anda sudah menjawabnya di bulan ini", {})
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const resultKPSP = async(req, res) => {
    try {

        const { id } = req.params;
        const pasien = await Pasien.findByPk(id);

        const { tanggal_lahir } = pasien;

        const usiaPembulatan = hitungUsiaDalamBulan(tanggal_lahir);
        const rangeId = await getRangeID(usiaPembulatan);

        const KuesionerId = await Kuesioner.findOne({
            where:{
                kelompok_usia_id: rangeId[0].id
            }
        })

        const allSoal = await TransactionKPSP.findAll({
            where:{
                pasien_id: id,
                kuesioner_id: KuesionerId.dataValues.id,
                attempt: usiaPembulatan,
            }
        })
        if (allSoal.length < 9){
            return error(res, "Anda belum menjawab semua pertanyaan")
        }

        const allSoalFormated = allSoal.map(item => item.dataValues.value);
        const nilai = allSoalFormated.filter(item => item == 'Y')

        let hasil;
        if ((nilai.length) < 6) {
            hasil = "Penyimpangan"
        }else if (nilai.length < 8) {
            hasil = "Meragukan"
        }else hasil = "Sesuai Umur"

        const patient = await TransactionPertumbuhan.findOne({
            where:{
                attempt: usiaPembulatan,
                umur: usiaPembulatan,
                pasien_id: req.body.id,
            }
        })
        const pushKpsp = await patient.update({
            hasil_KPSP: hasil
        })

        return success(res, "berhasil", pushKpsp)

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}