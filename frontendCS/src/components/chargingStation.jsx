import React, { useState, useEffect } from "react";
import apiFetch from "../utils/apiFetch";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 30.7333,
  lng: 76.7794,
};

const MapView = ({ chargers, selectedCharger, setSelectedCharger, onCloseInfo }) => (
  <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
    <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
      {chargers.map((charger) => (
        <Marker
          key={charger._id}
          position={{
            lat: Number(charger.location.latitude),
            lng: Number(charger.location.longitude),
          }}
          onClick={() => setSelectedCharger(charger)}
        />
      ))}

      {selectedCharger && (
        <InfoWindow
          position={{
            lat: Number(selectedCharger.location.latitude),
            lng: Number(selectedCharger.location.longitude),
          }}
          onCloseClick={onCloseInfo}
        >
          <div>
            <h2 className="font-bold">{selectedCharger.name}</h2>
            <p>Status: {selectedCharger.status}</p>
            <p>Power Output: {selectedCharger.powerOutput}</p>
            <p>Connector Type: {selectedCharger.connectorType}</p>
            <p>
              Location: {selectedCharger.location.latitude}, {selectedCharger.location.longitude}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  </LoadScript>
);

const Chargers = () => {
  const [chargers, setChargers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCharger, setCurrentCharger] = useState(null);
  const [newCharger, setNewCharger] = useState({
    name: "",
    location: { latitude: "", longitude: "" },
    status: "Active",
    powerOutput: "",
    connectorType: "",
  });
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState(null);

  const fetchChargers = async () => {
    setError("");
    try {
      const data = await apiFetch("/charging-stations");
      setChargers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, []);

  const handleDelete = async (id) => {
    setError("");
    try {
      await apiFetch(`/charging-stations/${id}`, { method: "DELETE" });
      setChargers(chargers.filter((charger) => charger._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddCharger = async () => {
    setError("");
    try {
      if (isEdit) {
        await apiFetch(`/charging-stations/${currentCharger._id}`, {
          method: "PUT",
          body: JSON.stringify(newCharger),
        });
        fetchChargers();
      } else {
        const data = await apiFetch("/charging-stations", {
          method: "POST",
          body: JSON.stringify(newCharger),
        });
        setChargers([...chargers, data]);
      }
      setIsModalOpen(false);
      resetChargerForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetChargerForm = () => {
    setNewCharger({
      name: "",
      location: { latitude: "", longitude: "" },
      status: "Active",
      powerOutput: "",
      connectorType: "",
    });
    setCurrentCharger(null);
    setIsEdit(false);
  };

  const handleEdit = (charger) => {
    setNewCharger({
      name: charger.name,
      location: charger.location,
      status: charger.status,
      powerOutput: charger.powerOutput,
      connectorType: charger.connectorType,
    });
    setCurrentCharger(charger);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const filteredChargers = chargers.filter((charger) => {
    const query = searchQuery.toLowerCase();
    return (
      charger.name.toLowerCase().includes(query) ||
      charger.status.toLowerCase().includes(query) ||
      charger.connectorType.toLowerCase().includes(query) ||
      charger.powerOutput.toString().includes(query) ||
      charger.location.latitude.toString().includes(query) ||
      charger.location.longitude.toString().includes(query)
    );
  });

  const onCloseInfo = () => setSelectedCharger(null);

  return (
    <div className="min-h-screen flex justify-center items-start pt-12 bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg relative overflow-hidden m-1 p-6 flex flex-col max-w-full sm:max-w-[600px] md:max-w-[1100px] w-full">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Charging Stations</h1>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <div className="flex justify-center items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search chargers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2 p-3 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={() => {
              resetChargerForm();
              setIsModalOpen(true);
              setShowMap(false);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Charger
          </button>
          <button
            onClick={() => {
              setShowMap(!showMap);
              setSelectedCharger(null);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {showMap ? "List View" : "Map View"}
          </button>
        </div>

        {!showMap ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border border-gray-300 p-3">Name</th>
                  <th className="border border-gray-300 p-3">Location</th>
                  <th className="border border-gray-300 p-3">Status</th>
                  <th className="border border-gray-300 p-3">Power Output</th>
                  <th className="border border-gray-300 p-3">Connector Type</th>
                  <th className="border border-gray-300 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChargers.map((charger) => (
                  <tr key={charger._id} className="odd:bg-white even:bg-gray-100">
                    <td className="border border-gray-300 p-3">{charger.name}</td>
                    <td className="border border-gray-300 p-3">
                      {charger.location.latitude}, {charger.location.longitude}
                    </td>
                    <td className="border border-gray-300 p-3">{charger.status}</td>
                    <td className="border border-gray-300 p-3">{charger.powerOutput}</td>
                    <td className="border border-gray-300 p-3">{charger.connectorType}</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <button
                        onClick={() => handleEdit(charger)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(charger._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <MapView
            chargers={filteredChargers}
            selectedCharger={selectedCharger}
            setSelectedCharger={setSelectedCharger}
            onCloseInfo={onCloseInfo}
          />
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Charger" : "Add New Charger"}</h2>
              <input
                type="text"
                placeholder="Name"
                value={newCharger.name}
                onChange={(e) => setNewCharger({ ...newCharger, name: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Latitude"
                value={newCharger.location.latitude}
                onChange={(e) =>
                  setNewCharger({
                    ...newCharger,
                    location: { ...newCharger.location, latitude: e.target.value },
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={newCharger.location.longitude}
                onChange={(e) =>
                  setNewCharger({
                    ...newCharger,
                    location: { ...newCharger.location, longitude: e.target.value },
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                placeholder="Power Output"
                value={newCharger.powerOutput}
                onChange={(e) => setNewCharger({ ...newCharger, powerOutput: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Connector Type"
                value={newCharger.connectorType}
                onChange={(e) => setNewCharger({ ...newCharger, connectorType: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <select
                value={newCharger.status}
                onChange={(e) => setNewCharger({ ...newCharger, status: e.target.value })}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetChargerForm();
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCharger}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chargers;
