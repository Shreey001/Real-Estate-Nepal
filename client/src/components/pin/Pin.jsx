import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";
import L from "leaflet";

function Pin({ item }) {
  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get the first image URL from the images array or use a default
  const imageUrl =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : item.img || "/house-placeholder.jpg";

  // Custom marker icon
  const customIcon = L.divIcon({
    className: "custom-pin",
    html: `<div class="pin-marker">$${formatPrice(item.price)}</div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });

  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup className="property-popup">
        <div className="popupContainer">
          <Link to={`/${item.id}`} className="popup-content">
            <div className="image-container">
              <img
                src={imageUrl}
                alt={item.title || "Property"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/house-placeholder.jpg";
                }}
              />
              <div className="price-tag">
                <span className="currency">$</span>
                {formatPrice(item.price)}
              </div>
            </div>
            <div className="textContainer">
              <h3 className="title">{item.title}</h3>
              <div className="details">
                <span className="bedrooms">
                  <i className="fas fa-bed"></i> {item.bedroom}{" "}
                  {item.bedroom === 1 ? "Bed" : "Beds"}
                </span>
                {item.bathroom && (
                  <span className="bathrooms">
                    <i className="fas fa-bath"></i> {item.bathroom}{" "}
                    {item.bathroom === 1 ? "Bath" : "Baths"}
                  </span>
                )}
              </div>
              <span className="view-details">View Details →</span>
            </div>
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
