import {success, error} from "../lib/Responser.js"
import KelompokUsia from "../models/DataMasterKelompokUsia.js";
import Kuesioner from "../models/DataMasterKuesioner.js";
import Pasien from "../models/PasienModel.js";
import TransactionPertumbuhan from "../models/TranscationModelPertumbuhan.js";
import { getZScoreWeightForLength, dataWFLBoys02, dataWFLBoys25, dataWFLGirls02, dataWFLGirls25 } from "../lib/WFL.js";
import { getZScoreLengthForAge, dataLFABoys02, dataLFABoys25, dataLFAGirls02, dataLFAGirls25 } from "../lib/LFA.js";
import { getZScoreHeadForAge, dataHCFABoys05, dataHCFAgirl05 } from "../lib/HCFA.js";
import { getZScoreBMI, dataBMIBoys02, dataBMIBoys25, dataBMIGirls02, dataBMIGirls25 } from "../lib/BMI.js";

function mappingWfl(length, weight, age, gender){
    let zScore;

    if (gender == 'L'){
        console.log("1here")
        if (age <= 24){
            zScore = getZScoreWeightForLength(length, weight, dataWFLBoys02)
        }else{
            zScore = getZScoreWeightForLength(length, weight, dataWFLBoys25)
        }
    }else{
        if (age <= 24){
            zScore = getZScoreWeightForLength(length, weight, dataWFLGirls02)
        }else{
            zScore = getZScoreWeightForLength(length, weight, dataWFLGirls25)
        }
    }

    console.log(zScore)

    if (zScore < -3){
        return "Sangat Kurus"
    }else if (zScore < -2){
        return "Kurus"
    }else if (zScore < 2){
        return "Normal"
    }else {
        return "Gemuk"
    }
}

function mappingLfa(length, age, gender){
    let zScore

    if (gender == 'L'){
        if (age <= 24){
            zScore = getZScoreLengthForAge(age, length, dataLFABoys02)
        }else{
            zScore = getZScoreLengthForAge(age, length, dataLFABoys25)
        }
    }else{
        if (age <= 24){
            zScore = getZScoreLengthForAge(age, length, dataLFAGirls02)
        }else{
            zScore = getZScoreLengthForAge(age, length, dataLFAGirls25)
        }
    }

    if (zScore < -3){
        return "Sangat Pendek"
    }else if (zScore < -2){
        return "Pendek"
    }else if (zScore < 2){
        return "Normal"
    }else {
        return "Tinggi"
    }
}

function mappingBmi(length, weight, age, gender){
    let zScore;

    if (gender == 'L'){
        if (age <= 24){
            zScore = getZScoreBMI(age, length, weight, dataBMIBoys02)
        }else{
            zScore = getZScoreBMI(age, length, weight, dataBMIBoys25)
        }
    }else{
        if (age <= 24){
            zScore = getZScoreBMI(age, length, weight, dataBMIGirls02)
        }else{
            zScore = getZScoreBMI(age, length, weight, dataBMIGirls25)
        }
    }

    if (zScore < -3){
        return "Sangat Kurus"
    }else if (zScore < -2){
        return "Kurus"
    }else if (zScore < 1){
        return "Normal"
    }else if (zScore < 2){
        return "Gemuk"
    }else {
        return "Obesitas"
    }
}

function mappingHcfa(age, hc, gender){
    let zScore;

    if (gender == 'L'){
        zScore = getZScoreHeadForAge(age, hc, dataHCFABoys05)
    }else{
        zScore = getZScoreHeadForAge(age, hc, dataHCFAgirl05)
    }
    if (zScore < -2){
        return "Makrosefali"
    }else if (zScore < 2){
        return "Normal"
    }else {
        return "Makrosefali"
    }
}



function hitungUsiaDalamBulan(tanggalLahir) {
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


export const calculatePertumbuhan = async(req, res) => {
    try {
        const { id } = req.params

        const pasien = await Pasien.findByPk(id);
        const { tanggal_lahir, jenis_kelamin} = pasien;
        const {panjang, berat_badan, lingkar_kepala} = req.body

        const usiaPembulatan = hitungUsiaDalamBulan(tanggal_lahir);

        let isAnswered = await TransactionPertumbuhan.findOne({
            where:{
                pasien_id: id,
                attempt: usiaPembulatan
            }
        })
        //isAnswered= false

        if (!isAnswered){
            const newTransaction = await TransactionPertumbuhan.create({
                pasien_id: id,
                attempt: usiaPembulatan,
                panjang: panjang,
                berat_badan: berat_badan,
                lingkar_kepala: lingkar_kepala,
                umur: usiaPembulatan,
                hasil_BMI: mappingBmi(panjang, berat_badan, usiaPembulatan, jenis_kelamin),
                hasil_HCFA: mappingHcfa(usiaPembulatan, lingkar_kepala, jenis_kelamin),
                hasil_LFA: mappingLfa(panjang, usiaPembulatan, jenis_kelamin),
                hasil_WFL: mappingWfl(panjang, berat_badan, usiaPembulatan, jenis_kelamin)
            })

            return success(res, "Berhasil menambahkan transaction !", newTransaction)
        }
        return error(res, "Anda sudah menjawabnya di bulan ini", {})
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const getAllResult = async (req, res) => {
    try {
        const { id } = req.params;

        const pasien = await Pasien.findOne({
            where: { id },
            attributes: ['nama', 'alamat', 'nik', 'tanggal_lahir', 'jenis_kelamin']
        });
        const { tanggal_lahir, jenis_kelamin } = pasien;
        pasien.dataValues.tanggal_lahir = tanggal_lahir.toDateString();
        const usiaPembulatan = hitungUsiaDalamBulan(tanggal_lahir)
        pasien.dataValues.umur = usiaPembulatan;
        pasien.jenis_kelamin = jenis_kelamin === 'L' ? 'Laki - Laki' : 'Perempuan';

        const allResult = await TransactionPertumbuhan.findAll({
            where:{pasien_id:id},
            attributes:['umur', 'hasil_BMI', 'hasil_HCFA', 'hasil_WFL', 'hasil_KPSP', 'hasil_LFA'],
            order: [['umur', 'ASC']]
        })
        const result_table = allResult.map(item => item.dataValues)
        const response = {pasien, result_table}

        return success(res, "Anda sudah menjawabnya di bulan ini", response);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



