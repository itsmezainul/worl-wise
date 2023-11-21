import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContex";
import Button from "./Button";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlLoaction } from "../hooks/useUrlLoaction";
import User from "./User";

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const [lat, lng] = useUrlLoaction();
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    },
    [geoLocationPosition]
  );

  return (
    <>
      <User />
      <div className={styles.mapContainer}>
        {!geoLocationPosition && (
          <Button type="position" onClick={getPosition}>
            {isLoadingPosition ? "Loading..." : "USE CURRUNT POSITION"}
          </Button>
        )}
        <MapContainer
          center={mapPosition}
          zoom={6}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />
          {cities.map((city) => (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          ))}
          <ChangeView position={mapPosition} />
          <DetectClick />
        </MapContainer>
      </div>
    </>
  );
}

function ChangeView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
