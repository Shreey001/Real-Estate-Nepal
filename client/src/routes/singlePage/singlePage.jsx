import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { useLoaderData, redirect } from "react-router-dom";
import DOMPurify from "dompurify";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);

  const handleSave = async () => {
    if (!currentUser) {
      redirect("/login");
      return;
    }

    try {
      await apiRequest.post("/users/save", { postId: post.id });
      setSaved((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format distance
  const formatDistance = (meters) => {
    return meters > 1000 ? (meters / 1000).toFixed(1) + "km" : meters + "m";
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="Location" />
                  <span>{post.address}</span>
                </div>
                <div className="price">${formatPrice(post.price)}</div>
              </div>
              <div className="user">
                <img
                  src={post.user.avatar || "/default-avatar.png"}
                  alt={post.user.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <span>{post.user.name}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            />
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General Information</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="Utilities" />
              <div className="featureText">
                <span>Utilities</span>
                <p>
                  {post.postDetail.utilities === "owner"
                    ? "Owner is responsible"
                    : "Renter is responsible"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="Pet Policy" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>
                  {post.postDetail.pet === "allowed"
                    ? "Pets Allowed"
                    : "No Pets Allowed"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="Income Requirements" />
              <div className="featureText">
                <span>Income Requirements</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>

          <p className="title">Property Details</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="Size" />
              <span>{formatPrice(post.postDetail.size)} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="Bedrooms" />
              <span>
                {post.bedroom} {post.bedroom === 1 ? "Bedroom" : "Bedrooms"}
              </span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="Bathrooms" />
              <span>
                {post.bathroom} {post.bathroom === 1 ? "Bathroom" : "Bathrooms"}
              </span>
            </div>
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="School" />
              <div className="featureText">
                <span>School</span>
                <p>{formatDistance(post.postDetail.school)} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="Bus Stop" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{formatDistance(post.postDetail.bus)} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="Restaurant" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{formatDistance(post.postDetail.restaurant)} away</p>
              </div>
            </div>
          </div>

          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>

          <div className="buttons">
            <button>
              <img src="/chat.png" alt="Message" />
              Contact Owner
            </button>
            <button onClick={handleSave}>
              <img src="/save.png" alt="Save" />
              {saved ? "Saved" : "Save Property"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
