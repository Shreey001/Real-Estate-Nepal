import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const typeOptions = ["buy", "rent", "all"];
const propertyTypes = ["house", "apartment", "condo", "land"];
const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];
const bathroomOptions = ["Any", "1+", "2+", "3+", "4+"];

// Default price values
const DEFAULT_MIN_PRICE = "10000";
const DEFAULT_MAX_PRICE = "100000000";

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || DEFAULT_MIN_PRICE
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || DEFAULT_MAX_PRICE
  );

  // State for property type (house, apartment, etc)
  const [propertyType, setPropertyType] = useState(
    // Get property type from the 'property' param which matches the Prisma schema
    searchParams.get("property") || ""
  );

  // State for listing type (buy/rent)
  const [listingType, setListingType] = useState(() => {
    const type = searchParams.get("type");

    // Check if type is buy or rent
    if (type === "buy" || type === "rent") {
      return type;
    }
    // Default to "all"
    return "all";
  });

  const [bedroom, setBedroom] = useState(searchParams.get("bedroom") || "");
  const [bathroom, setBathroom] = useState(searchParams.get("bathroom") || "");

  // Check for window resize to handle collapsed state
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Keep search parameters in sync with URL
  useEffect(() => {
    setSearchTerm(searchParams.get("searchTerm") || "");

    // Apply default min and max prices if not provided in URL
    setMinPrice(searchParams.get("minPrice") || DEFAULT_MIN_PRICE);
    setMaxPrice(searchParams.get("maxPrice") || DEFAULT_MAX_PRICE);

    // Handle property type (house, apartment, etc)
    const propertyFromUrl = searchParams.get("property");
    setPropertyType(propertyFromUrl || "");

    // Handle listing type (buy/rent/all)
    const typeFromUrl = searchParams.get("type");

    // Check if type is buy or rent
    if (typeFromUrl === "buy" || typeFromUrl === "rent") {
      setListingType(typeFromUrl);
    } else {
      setListingType("all");
    }

    setBedroom(searchParams.get("bedroom") || "");
    setBathroom(searchParams.get("bathroom") || "");
  }, [searchParams]);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleTypeToggle = (type) => {
    setListingType(type);

    // Apply the change immediately for better UX
    const params = new URLSearchParams(searchParams);

    if (type !== "all") {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    setSearchParams(params);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    // Only add parameters that have values
    if (searchTerm) params.set("searchTerm", searchTerm);
    else params.delete("searchTerm");

    // Always include min and max prices with defaults if not specified
    params.set("minPrice", minPrice || DEFAULT_MIN_PRICE);
    params.set("maxPrice", maxPrice || DEFAULT_MAX_PRICE);

    // Handle property type (house, apartment, etc)
    if (propertyType) {
      params.set("property", propertyType); // Use 'property' to match backend API
    } else {
      params.delete("property");
    }

    // Handle listing type (buy/rent)
    if (listingType && listingType !== "all") {
      params.set("type", listingType); // Use 'type' for buy/rent as per backend API
    } else {
      params.delete("type");
    }

    // Clean up any old parameters
    params.delete("propertyType");

    if (bedroom) params.set("bedroom", bedroom);
    else params.delete("bedroom");

    if (bathroom) params.set("bathroom", bathroom);
    else params.delete("bathroom");

    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchTerm("");
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setPropertyType("");
    setListingType("all");
    setBedroom("");
    setBathroom("");

    // Reset URL params but keep the default price values
    const params = new URLSearchParams();
    params.set("minPrice", DEFAULT_MIN_PRICE);
    params.set("maxPrice", DEFAULT_MAX_PRICE);
    setSearchParams(params);
  };

  const hasFilters =
    searchTerm ||
    propertyType ||
    (listingType && listingType !== "all") ||
    bedroom ||
    bathroom ||
    // Check if min/max prices are different from defaults
    (minPrice && minPrice !== DEFAULT_MIN_PRICE) ||
    (maxPrice && maxPrice !== DEFAULT_MAX_PRICE);

  // Function to get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (minPrice && minPrice !== DEFAULT_MIN_PRICE) count++;
    if (maxPrice && maxPrice !== DEFAULT_MAX_PRICE) count++;
    if (propertyType) count++;
    if (listingType && listingType !== "all") count++;
    if (bedroom) count++;
    if (bathroom) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`filter ${isCollapsed ? "collapsed" : ""}`}>
      <div className="filterHeader">
        <h1>
          Find your <b>perfect property</b>
          {activeFilterCount > 0 && (
            <span className="filterCount">{activeFilterCount}</span>
          )}
        </h1>
        <button
          type="button"
          className="toggleBtn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
        >
          {isCollapsed ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="expandIcon"
            >
              <path
                d="M12 6V18M6 12H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="collapseIcon"
            >
              <path
                d="M6 12H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className={isCollapsed ? "hidden" : ""}>
        <div className="typeToggle">
          {typeOptions.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeToggle(type)}
              className={listingType === type ? "active" : ""}
            >
              {type === "buy" && <span className="icon">🏠</span>}
              {type === "rent" && <span className="icon">🔑</span>}
              {type === "all" && <span className="icon">🔍</span>}
              {type}
            </button>
          ))}
        </div>

        <div className="top">
          <div className="item">
            <label htmlFor="searchTerm">Location</label>
            <input
              id="searchTerm"
              type="text"
              placeholder="Address, City, or Neighborhood"
              value={searchTerm}
              onChange={handleChange(setSearchTerm)}
            />
          </div>
        </div>

        <div className="bottom">
          <div className="item">
            <label htmlFor="propertyType">Property Type</label>
            <select
              id="propertyType"
              value={propertyType}
              onChange={handleChange(setPropertyType)}
            >
              <option value="">Any</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              id="minPrice"
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={handleChange(setMinPrice)}
            />
          </div>
          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              id="maxPrice"
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={handleChange(setMaxPrice)}
            />
          </div>
          <div className="item">
            <label htmlFor="bedroom">Bedrooms</label>
            <select
              id="bedroom"
              value={bedroom}
              onChange={handleChange(setBedroom)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="bathroom">Bathrooms</label>
            <select
              id="bathroom"
              value={bathroom}
              onChange={handleChange(setBathroom)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
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
    </div>
  );
};

export default Filter;
