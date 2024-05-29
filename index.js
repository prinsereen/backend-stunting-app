import express from "express";
import cors from "cors";  // Importing cors
import db from "./config/Database.js";
import Dokter from "./models/DokterModel.js";
import KelompokUsia from "./models/DataMasterKelompokUsia.js";
import Kuesioner from "./models/DataMasterKuesioner.js";
import SoalItem from "./models/DataMasterSoalItem.js";
import Pasien from "./models/PasienModel.js";
import Result from "./models/ResultModel.js";
import TransactionKPSP from "./models/TransactionModelKPSP.js";
import TransactionPertumbuhan from "./models/TranscationModelPertumbuhan.js";
import Parent from "./models/ParentModel.js";
import ParentPatient from "./models/ParentPatientModel.js";
import bodyParser from "body-parser";
import AuthRoute from "./routes/AuthRoute.js";
import AuhtParent from "./routes/AuthParent.js";
import PasienRoute from "./routes/PasienRoute.js";
import KpspRoute from "./routes/EvaluationRoute.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

try {
    await db.authenticate();
    console.log("Database Connected ...");
    //await db.sync()
} catch (error) {
    console.log(error);
}

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.json());
app.use(AuthRoute);
app.use(PasienRoute);
app.use(AuhtParent);
app.use(KpspRoute);

app.listen(5000, () => console.log("server running on port 5000"));
