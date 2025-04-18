import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { icon } from "leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

// Create custom icon using the blue pin SVG
const customIcon = icon({
  iconUrl: "/blue-pin.svg",
  iconSize: [24, 36], // Width and height of the icon
  iconAnchor: [12, 36], // Point of the icon which will correspond to marker's location (middle bottom)
  popupAnchor: [0, -36], // Point from which the popup should open relative to the iconAnchor
});

function Map({ items = [] }) {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        // Get the container element
        const container = mapRef.current._container;

        // Remove the map instance
        mapRef.current.remove();

        // Clean up any leaflet-related attributes on the container
        if (container) {
          container._leaflet_id = null;
          container._leaflet = null;
        }

        // Clear the ref
        mapRef.current = null;
      }
    };
  }, []);

  const handleViewDetails = (itemId) => {
    // Close popup before navigation to prevent the error
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
    // Navigate directly to the ID
    navigate(`/${itemId}`);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const center = items[0]
    ? [items[0].latitude, items[0].longitude]
    : [27.7172, 85.324]; // Default to Kathmandu

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="map"
      ref={mapRef}
      key={items[0]?.id}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div className="popup">
              <img src={item.images[0]} alt="" />
              <div className="textContainer">
                <h3>{item.title}</h3>
                <p>{item.address}</p>
                <button
                  className="view-details-btn"
                  onClick={() => handleViewDetails(item.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
