import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';


import authRoutes from "../routes/authRoutes.js";
import chargingStationRoutes from "../routes/chargingStationRoutes.js";



dotenv.config();


const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/charging-stations", chargingStationRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});