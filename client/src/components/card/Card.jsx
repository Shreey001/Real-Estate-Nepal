import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item }) {
  // Determine property status based on type (rent/buy)
  const propertyStatus = item.type === "rent" ? "For Rent" : "For Sale";

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <div className="propertyType">{item.property}</div>
        <div className="propertyStatus">{propertyStatus}</div>
        <img src={item.images[0]} alt={item.title} />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="location" />
          <span>
            {item.address}, {item.city}
          </span>
        </p>
        <p className="price">${formatPrice(item.price)}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="bedrooms" />
              <span>
                {item.bedroom} {item.bedroom > 1 ? "beds" : "bed"}
              </span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="bathrooms" />
              <span>
                {item.bathroom} {item.bathroom > 1 ? "baths" : "bath"}
              </span>
            </div>
          </div>
          <div className="icons">
            <div className="icon" title="Save">
              <img src="/save.png" alt="save" />
            </div>
            <div className="icon" title="Contact">
              <img src="/chat.png" alt="contact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
