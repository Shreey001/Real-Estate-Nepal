import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";

function Map({ items = [] }) {
  const validItems = Array.isArray(items) ? items : [];
  const defaultCenter = [27.7172, 85.324]; // Default to Kathmandu center

  return (
    <MapContainer
      center={
        validItems.length === 1
          ? [validItems[0].latitude, validItems[0].longitude]
          : defaultCenter
      }
      zoom={validItems.length === 1 ? 13 : 11} // Zoom level 11 for city-wide view of Kathmandu
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validItems.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
