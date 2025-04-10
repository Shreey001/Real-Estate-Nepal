import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./featuredProperties.scss";
import Card from "../card/Card";
import apiRequest from "../../lib/apiRequest";

// Simple error boundary component
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state when children change
  useEffect(() => {
    setHasError(false);
  }, [children]);

  // Handle errors during render
  if (hasError) {
    return (
      fallback || (
        <div className="error-message">
          Something went wrong. Please try again later.
        </div>
      )
    );
  }

  // Try to render children, catch errors
  try {
    return children;
  } catch (error) {
    console.error("Error in FeaturedProperties component:", error);
    setHasError(true);
    return (
      fallback || (
        <div className="error-message">
          Something went wrong. Please try again later.
        </div>
      )
    );
  }
};

export default function FeaturedProperties() {
  const [savedStates, setSavedStates] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Use axios apiRequest with proper error handling
        const response = await apiRequest.get("/posts");

        // Check if we have valid data
        if (response && response.data && Array.isArray(response.data)) {
          // Get first 4 properties
          setProperties(response.data.slice(0, 6));
        } else {
          console.warn("Unexpected response format:", response);
          setError("No properties found");
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        // Handle different types of errors
        if (error.response) {
          // Server responded with error status
          setError(`Server error: ${error.response.status}`);
        } else if (error.request) {
          // Request made but no response
          setError("No response from server. Please check your connection.");
        } else {
          // Other errors
          setError("Failed to load properties. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSaveChange = (postId, isSaved) => {
    // Ensure postId is treated as a string
    const postIdString = String(postId);
    setSavedStates((prev) => ({
      ...prev,
      [postIdString]: isSaved,
    }));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="featured-properties">
          {[1, 2, 3, 4].map((placeholder) => (
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

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!properties || properties.length === 0) {
      return <div className="error-message">No properties available.</div>;
    }

    return (
      <div className="featured-properties">
        {properties.map((property) => (
          <Card
            key={property.id}
            item={{
              ...property,
              // Ensure id is treated as a string for MongoDB ObjectID compatibility
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
    );
  };

  return (
    <section className="featured-properties-section">
      <div className="section-container">
        <h2 className="section-title">Featured Properties</h2>
        <p className="section-description">
          Discover our handpicked selection of premium properties
        </p>

        <ErrorBoundary>{renderContent()}</ErrorBoundary>

        <div className="view-all-link">
          <Link to="/list" className="view-all-btn">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
