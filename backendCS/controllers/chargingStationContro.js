import ChargingStation from "../models/chargingStation.js";

export const createChargingStation = async (req, res) => {
  try {
    const station = await ChargingStation.create(req.body);
    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllChargingStations = async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChargingStation = async (req, res) => {
  const { id } = req.params;
  try {
    const station = await ChargingStation.findByIdAndUpdate(id, req.body, { new: true });
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteChargingStation = async (req, res) => {
  const { id } = req.params;
  try {
    await ChargingStation.findByIdAndDelete(id);
    res.json({ message: "Charging station deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
