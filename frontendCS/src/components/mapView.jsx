import React from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapView = ({ chargers }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [selectedCharger, setSelectedCharger] = React.useState(null);

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div style={{ height: "500px", width: "100%" }} className="mt-4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 37.7749, lng: -122.4194 }}
        zoom={10}
      >
        {chargers.map((charger) => (
          <Marker
            key={charger._id}
            position={{
              lat: parseFloat(charger.location.latitude),
              lng: parseFloat(charger.location.longitude),
            }}
            onClick={() => setSelectedCharger(charger)}
          />
        ))}

        {selectedCharger && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedCharger.location.latitude),
              lng: parseFloat(selectedCharger.location.longitude),
            }}
            onCloseClick={() => setSelectedCharger(null)}
          >
            <div>
              <h3 className="font-bold">{selectedCharger.name}</h3>
              <p>Status: {selectedCharger.status}</p>
              <p>Power: {selectedCharger.powerOutput} kW</p>
              <p>Connector: {selectedCharger.connectorType}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;