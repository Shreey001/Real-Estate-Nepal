import { Link, useNavigate } from "react-router-dom";
import "./card.scss";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import apiRequest from "../../lib/apiRequest";

function Card({ item, onSaveChange }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(item.isSaved);
  const [isLoading, setIsLoading] = useState(false);

  // Make sure item.id is always a string
  const itemId = String(item.id);

  // Update saved state when item.isSaved changes
  useEffect(() => {
    setSaved(item.isSaved);
  }, [item.isSaved]);

  // Determine property status based on type (rent/buy)
  const propertyStatus = item.type === "rent" ? "For Rent" : "For Sale";

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault(); // Prevent navigation when clicking save
      e.stopPropagation(); // Prevent event bubbling

      if (!currentUser) {
        navigate("/login");
        return;
      }

      if (isLoading) return; // Prevent multiple clicks while loading

      try {
        setIsLoading(true);
        await apiRequest.post("/users/save", {
          postId: itemId, // Use the string version
        });

        // Update local state
        const newSavedState = !saved;
        setSaved(newSavedState);

        // Notify parent component about the change
        if (onSaveChange) {
          onSaveChange(itemId, newSavedState);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, itemId, navigate, saved, isLoading, onSaveChange]
  );

  const handleContact = useCallback(
    (e) => {
      e.preventDefault(); // Prevent navigation
      e.stopPropagation(); // Prevent event bubbling

      if (!currentUser) {
        navigate("/login");
        return;
      }

      // Navigate to the property page for contact
      navigate(`/${itemId}`);
    },
    [currentUser, itemId, navigate]
  );

  return (
    <div className="card">
      <Link to={`/${itemId}`} className="imageContainer">
        <div className="propertyType">{item.property}</div>
        <div className="propertyStatus">{propertyStatus}</div>
        <img src={item.images[0]} alt={item.title} />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${itemId}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="location" />
          <span>
            {item.address}, {item.city}
          </span>
        </p>
        <p className="price">Rs.{formatPrice(item.price)}</p>
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
            <button
              onClick={handleSave}
              className={`icon save-button ${saved ? "saved" : ""} ${
                isLoading ? "loading" : ""
              }`}
              title={saved ? "Remove from saved" : "Save property"}
              disabled={isLoading}
            >
              {saved ? <BsBookmarkFill /> : <BsBookmark />}
            </button>
            <button
              onClick={handleContact}
              className="icon contact-button"
              title="Contact owner"
            >
              <IoChatbubbleEllipsesOutline />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
