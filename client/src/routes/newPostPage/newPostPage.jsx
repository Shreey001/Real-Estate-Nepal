import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import UploadWidgets from "../../components/uploadWidgets/UploadWidgets";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../../components/locationPicker/LocationPicker";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
    address: "",
    city: "",
    neighborhood: "",
  });
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Use coordinates state if available, otherwise use form input values
    const latitude = coordinates.latitude || parseFloat(inputs.latitude);
    const longitude = coordinates.longitude || parseFloat(inputs.longitude);
    const address = coordinates.address || inputs.address;
    const city = coordinates.city || inputs.city;
    const location = coordinates.neighborhood || inputs.location;

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseFloat(inputs.price),
          address: address,
          city: city,
          location: location,
          bedroom: parseInt(inputs.bedroom),
          type: inputs.type,
          property: inputs.property,
          bathroom: parseInt(inputs.bathroom),
          latitude: latitude,
          longitude: longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: parseFloat(inputs.income),
          size: parseFloat(inputs.size),
          school: parseFloat(inputs.school),
          bus: parseFloat(inputs.bus),
          restaurant: parseFloat(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while creating the post"
      );
      console.error("Error details:", error.response?.data);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  // Function to handle removing an image
  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // Function to handle location selection from the map
  const handleLocationSelect = (locationData) => {
    // Only update state if there's an actual change to avoid loops
    if (
      locationData.latitude !== coordinates.latitude ||
      locationData.longitude !== coordinates.longitude ||
      locationData.address !== coordinates.address ||
      locationData.city !== coordinates.city ||
      locationData.neighborhood !== coordinates.neighborhood
    ) {
      setCoordinates({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address || "",
        city: locationData.city || "",
        neighborhood: locationData.neighborhood || "",
      });
    }
  };

  return (
    <div className="newPostPage">
      <div className="page-scroll-container">
        <div className="page-header">
          <h1>Create New Listing</h1>
          <p>Fill out the details below to list your property</p>
        </div>

        <div className="content-wrapper">
          <div className="formContainer">
            <form onSubmit={handleSubmit}>
              <h2 className="section-title">
                <span className="icon">📝</span>Basic Information
              </h2>
              <div className="form-grid">
                <div className="item full-width">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter an attractive title"
                    required
                  />
                </div>

                <div className="item">
                  <label htmlFor="price">Price (Rs)</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                  />
                </div>

                <div className="item">
                  <label htmlFor="size">Total Size (sqft)</label>
                  <input
                    id="size"
                    name="size"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Square footage"
                    required
                  />
                </div>

                <div className="item">
                  <label htmlFor="type">Property Purpose</label>
                  <select name="type" id="type" required defaultValue="rent">
                    <option value="rent">For Rent</option>
                    <option value="buy">For Sale</option>
                  </select>
                </div>

                <div className="item">
                  <label htmlFor="property">Property Type</label>
                  <select name="property" id="property" required>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                <div className="item">
                  <label htmlFor="bedroom">Bedrooms</label>
                  <input
                    min={1}
                    id="bedroom"
                    name="bedroom"
                    type="number"
                    required
                    placeholder="Number of bedrooms"
                  />
                </div>

                <div className="item">
                  <label htmlFor="bathroom">Bathrooms</label>
                  <input
                    min={1}
                    id="bathroom"
                    name="bathroom"
                    type="number"
                    required
                    placeholder="Number of bathrooms"
                  />
                </div>
              </div>

              <h2 className="section-title">
                <span className="icon">📍</span>Location
              </h2>
              <div className="form-grid">
                <div className="item">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City name (e.g. New York)"
                    required
                    value={coordinates.city || ""}
                    onChange={(e) =>
                      setCoordinates({
                        ...coordinates,
                        city: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="item">
                  <label htmlFor="location">Location/Neighborhood</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Neighborhood, district, etc."
                    value={coordinates.neighborhood || ""}
                    onChange={(e) =>
                      setCoordinates({
                        ...coordinates,
                        neighborhood: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="item full-width">
                  <label htmlFor="address">Street Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Full address"
                    required
                    value={coordinates.address || ""}
                    onChange={(e) =>
                      setCoordinates({
                        ...coordinates,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="item">
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    required
                    min="-90"
                    max="90"
                    placeholder="e.g. 45.5231"
                    value={coordinates.latitude || ""}
                    onChange={(e) =>
                      setCoordinates({
                        ...coordinates,
                        latitude: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>

                <div className="item">
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    required
                    min="-180"
                    max="180"
                    placeholder="e.g. -122.6765"
                    value={coordinates.longitude || ""}
                    onChange={(e) =>
                      setCoordinates({
                        ...coordinates,
                        longitude: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>

                <div className="item full-width map-toggle">
                  <button
                    type="button"
                    className={`toggle-map-btn ${showMap ? "active" : ""}`}
                    onClick={() => setShowMap(!showMap)}
                  >
                    <span className="icon">{showMap ? "🗺️" : "📍"}</span>
                    {showMap
                      ? "Hide Map Selector"
                      : "Use Map to Select Location"}
                  </button>
                </div>

                {showMap && (
                  <div className="item full-width map-area">
                    <LocationPicker
                      onSelectLocation={handleLocationSelect}
                      initialLat={coordinates.latitude}
                      initialLng={coordinates.longitude}
                    />
                  </div>
                )}
              </div>

              <h2 className="section-title">
                <span className="icon">📋</span>Property Details
              </h2>
              <div className="form-grid">
                <div className="item description full-width">
                  <label htmlFor="desc">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    modules={quillModules}
                    className="quill-editor"
                  />
                </div>

                <div className="item">
                  <label htmlFor="utilities">Utilities Policy</label>
                  <select name="utilities" id="utilities" required>
                    <option value="owner">Owner is responsible</option>
                    <option value="tenant">Tenant is responsible</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>

                <div className="item">
                  <label htmlFor="pet">Pet Policy</label>
                  <select name="pet" id="pet" required>
                    <option value="allowed">Pets Allowed</option>
                    <option value="not-allowed">No Pets Allowed</option>
                  </select>
                </div>

                <div className="item">
                  <label htmlFor="income">Min Income Required (Rs)</label>
                  <input
                    id="income"
                    name="income"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Annual income required"
                    required
                  />
                </div>
              </div>

              <h2 className="section-title">
                <span className="icon">🚶</span>Distances
              </h2>
              <div className="form-grid">
                <div className="item">
                  <label htmlFor="school">Distance to School (miles)</label>
                  <input
                    id="school"
                    name="school"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Distance in miles"
                    required
                  />
                </div>

                <div className="item">
                  <label htmlFor="bus">Distance to Bus Stop (miles)</label>
                  <input
                    id="bus"
                    name="bus"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Distance in miles"
                    required
                  />
                </div>

                <div className="item">
                  <label htmlFor="restaurant">
                    Distance to Restaurant (miles)
                  </label>
                  <input
                    id="restaurant"
                    name="restaurant"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Distance in miles"
                    required
                  />
                </div>
              </div>

              <button className="sendButton" type="submit">
                Create Listing
              </button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>

          <div className="sideContainer">
            <div className="image-preview-container">
              <h3>
                Property Images
                {images.length > 0 && (
                  <span className="image-count">{images.length} images</span>
                )}
              </h3>
              <div className="image-list">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div className="image-item" key={index}>
                      <img
                        src={image}
                        alt={`Property preview ${index + 1}`}
                        title={`Property image ${index + 1}`}
                      />
                      <div className="image-actions">
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemoveImage(index)}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-images">No images uploaded yet</div>
                )}
              </div>
            </div>

            <div className="upload-container">
              <h3>Upload Images</h3>
              <p>Upload high-quality images of your property (max 10 images)</p>
              <UploadWidgets
                uwConfig={{
                  cloudName: "dqiqotjg4",
                  uploadPreset: "estatw",
                  multiple: true,
                  maxCount: 10,
                  maxImageFileSize: 2000000,
                  folder: "posts",
                }}
                setState={setImages}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
