import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [mode, setMode] = useState(searchParams.get("mode") || "");
  const [bedroom, setBedroom] = useState(searchParams.get("bedroom") || "");
  const [bathroom, setBathroom] = useState(searchParams.get("bathroom") || "");

  // Keep search parameters in sync with URL
  useEffect(() => {
    setSearchTerm(searchParams.get("searchTerm") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setType(searchParams.get("type") || "");
    setMode(searchParams.get("mode") || "");
    setBedroom(searchParams.get("bedroom") || "");
    setBathroom(searchParams.get("bathroom") || "");
  }, [searchParams]);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    // Only add parameters that have values
    if (searchTerm) params.set("searchTerm", searchTerm);
    else params.delete("searchTerm");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (type) params.set("type", type);
    else params.delete("type");

    if (mode) params.set("mode", mode);
    else params.delete("mode");

    if (bedroom) params.set("bedroom", bedroom);
    else params.delete("bedroom");

    if (bathroom) params.set("bathroom", bathroom);
    else params.delete("bathroom");

    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setType("");
    setMode("");
    setBedroom("");
    setBathroom("");
    setSearchParams({});
  };

  const hasFilters =
    searchTerm || minPrice || maxPrice || type || mode || bedroom || bathroom;

  return (
    <form className="filter" onSubmit={handleSubmit}>
      <h1>
        Search properties <b>for you</b>
      </h1>
      <div className="top">
        <div className="item">
          <label>Search term</label>
          <input
            type="text"
            placeholder="Address, City, or Neighborhood"
            value={searchTerm}
            onChange={handleChange(setSearchTerm)}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label>Type</label>
          <select value={type} onChange={handleChange(setType)}>
            <option value="">Any</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label>For</label>
          <select value={mode} onChange={handleChange(setMode)}>
            <option value="">All</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </div>
        <div className="item">
          <label>Min Price</label>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={handleChange(setMinPrice)}
          />
        </div>
        <div className="item">
          <label>Max Price</label>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={handleChange(setMaxPrice)}
          />
        </div>
        <div className="item">
          <label>Bedrooms</label>
          <select value={bedroom} onChange={handleChange(setBedroom)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div className="item">
          <label>Bathrooms</label>
          <select value={bathroom} onChange={handleChange(setBathroom)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <button type="submit" aria-label="Search properties">
          <img src="/search.png" alt="Search" />
        </button>
      </div>
      {hasFilters && (
        <div className="filterActions">
          <button type="button" className="resetButton" onClick={handleReset}>
            Reset Filters
          </button>
          <button type="submit" className="applyButton">
            Apply Filters
          </button>
        </div>
      )}
    </form>
  );
};

export default Filter;
