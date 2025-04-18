import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect, useCallback } from "react";
import {
  useLoaderData,
  Await,
  redirect,
  useRevalidator,
  useNavigate,
} from "react-router-dom";
import DOMPurify from "dompurify";
import apiRequest from "../../lib/apiRequest";
import { Suspense } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { AiOutlineShareAlt } from "react-icons/ai";
import ChatModal from "../../components/chat/ChatModal";
import Card from "../../components/card/Card";

const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-content">
      <div className="loading-spinner"></div>
      <p>Loading property details...</p>
    </div>
  </div>
);

// MapWrapper component to handle mounting/unmounting
const MapWrapper = ({ post }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, [post.id]);

  if (!mounted) {
    return <div className="mapContainer loading">Loading map...</div>;
  }

  return (
    <div className="mapContainer">
      <Map items={[post]} />
    </div>
  );
};

const SimilarProperties = ({ currentPostId }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedStates, setSavedStates] = useState({});

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        const response = await apiRequest.get("/posts");
        if (response && response.data && Array.isArray(response.data)) {
          // Filter out the current post and get 3 random properties
          const otherProperties = response.data.filter(
            (prop) => prop.id !== currentPostId
          );
          const randomProperties = otherProperties
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          setProperties(randomProperties);
        }
      } catch (error) {
        console.error("Failed to fetch similar properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentPostId]);

  const handleSaveChange = (postId, isSaved) => {
    setSavedStates((prev) => ({
      ...prev,
      [postId]: isSaved,
    }));
  };

  if (loading) {
    return (
      <div className="similar-properties-loading">
        {[1, 2, 3].map((placeholder) => (
          <div key={placeholder} className="card-placeholder">
            <div className="image-placeholder"></div>
            <div className="content-placeholder">
              <div className="title-placeholder"></div>
              <div className="details-placeholder"></div>
              <div className="price-placeholder"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="similar-properties-section">
      <h2>Similar Properties</h2>
      <div className="similar-properties">
        {properties.map((property) => (
          <Card
            key={property.id}
            item={{
              ...property,
              id: String(property.id),
              isSaved:
                savedStates[property.id] !== undefined
                  ? savedStates[property.id]
                  : property.isSaved || false,
            }}
            onSaveChange={handleSaveChange}
          />
        ))}
      </div>
    </div>
  );
};

function SinglePage() {
  const { post: postPromise } = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [showChatModal, setShowChatModal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = useCallback(
    async (post, setSaved) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        await apiRequest.post("/users/save", {
          postId: post.id,
        });
        setSaved((prev) => !prev);
        // Force a revalidation to get fresh data
        revalidator.revalidate();
      } catch (error) {
        console.error(error);
      }
    },
    [currentUser, revalidator, navigate]
  );

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format distance
  const formatDistance = (meters) => {
    return meters > 1000 ? (meters / 1000).toFixed(1) + "km" : meters + "m";
  };

  const renderPost = (post) => {
    const [saved, setSaved] = useState(post.isSaved);

    // Scroll to top when post changes
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [post.id]);

    useEffect(() => {
      setSaved(post.isSaved);
    }, [post.isSaved]);

    return (
      <>
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
                    <div className="price">Rs.{formatPrice(post.price)}</div>
                  </div>
                  <div className="user">
                    <img
                      src={post.user.avatar || "/default-avatar.png"}
                      alt={post.user.username}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <span>{post.user.username}</span>
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
              {/* Mobile-only quick action buttons */}
              <div className="mobile-actions">
                <button
                  className={`save-button ${saved ? "saved" : ""}`}
                  onClick={() => handleSave(post, setSaved)}
                >
                  {saved ? <BsBookmarkFill /> : <BsBookmark />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  className="contact-button"
                  onClick={() => setShowChatModal(true)}
                >
                  <IoChatbubbleEllipsesOutline />
                  Contact
                </button>
              </div>

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
                    {post.bathroom}{" "}
                    {post.bathroom === 1 ? "Bathroom" : "Bathrooms"}
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
              <MapWrapper post={post} />

              <div className="buttons">
                <button onClick={() => setShowChatModal(true)}>
                  <IoChatbubbleEllipsesOutline />
                  Contact Owner
                </button>
                <button
                  onClick={() => handleSave(post, setSaved)}
                  className={`save-button ${saved ? "saved" : ""}`}
                >
                  {saved ? <BsBookmarkFill /> : <BsBookmark />}
                  {saved ? "Saved" : "Save Property"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <SimilarProperties currentPostId={post.id} />
        {showChatModal && (
          <ChatModal
            receiverId={post.userId}
            receiverUsername={post.user?.username || "Property Owner"}
            receiverAvatar={post.user?.avatar || "/default-avatar.png"}
            onClose={() => setShowChatModal(false)}
          />
        )}
      </>
    );
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Await
        resolve={postPromise}
        errorElement={<div>Error loading property details</div>}
      >
        {renderPost}
      </Await>
    </Suspense>
  );
}

export default SinglePage;
