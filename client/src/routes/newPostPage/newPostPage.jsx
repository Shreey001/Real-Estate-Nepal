import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import UploadWidgets from "../../components/uploadWidgets/UploadWidgets";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseFloat(inputs.price),
          address: inputs.address,
          city: inputs.city,
          location: inputs.location,
          bedroom: parseInt(inputs.bedroom),
          type: inputs.type,
          property: inputs.property,
          bathroom: parseInt(inputs.bathroom),
          latitude: parseFloat(inputs.latitude),
          longitude: parseFloat(inputs.longitude),
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

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price ($)</label>
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
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="City name (e.g. New York)"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="location">
                Location/Neighborhood (searchable)
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Neighborhood, district, etc. (e.g. Manhattan)"
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Number of Bedrooms</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Number of Bathrooms</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                required
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
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" id="type" required defaultValue="rent">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
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
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Minimum Income Required ($)</label>
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
              <label htmlFor="school">Distance to Nearest School (miles)</label>
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
              <label htmlFor="restaurant">Distance to Restaurant (miles)</label>
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
            <button className="sendButton" type="submit">
              Add
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="post" />
        ))}
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
  );
}

export default NewPostPage;
