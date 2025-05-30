import express from "express";
import {
  createChargingStation,
  getAllChargingStations,
  updateChargingStation,
  deleteChargingStation,
} from "../controllers/chargingStationContro.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createChargingStation);
router.get("/", verifyToken, getAllChargingStations);
router.put("/:id", verifyToken, updateChargingStation);
router.delete("/:id", verifyToken, deleteChargingStation);

export default router;
