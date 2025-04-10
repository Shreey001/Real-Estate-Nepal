import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";
const types = ["all", "buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "all",
    searchTerm: "",
    minPrice: "",
    maxPrice: "",
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getSearchUrl = () => {
    const params = new URLSearchParams();

    // Set type parameter for buy/rent/all
    if (query.type && query.type !== "all") {
      params.append("type", query.type);
    }

    if (query.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query.minPrice) params.append("minPrice", query.minPrice);
    if (query.maxPrice) params.append("maxPrice", query.maxPrice);

    const url = `/list?${params.toString()}`;
    return url;
  };

  const handleSearch = () => {
    // Function kept for potential future functionality
  };

  const getSearchBarClass = () => {
    let classes = "searchBar";
    if (query.type === "buy") {
      classes += " buy-active";
    } else if (query.type === "rent") {
      classes += " rent-active";
    } else if (query.type === "all") {
      classes += " all-active";
    }
    return classes;
  };

  return (
    <div className={getSearchBarClass()}>
      <div className="search-container">
        <div className="type-selector">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => switchType(type)}
              className={query.type === type ? "active" : ""}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <div className="input-with-icon">
              <i className="fas fa-map-marker-alt"></i>
              <input
                type="text"
                name="searchTerm"
                value={query.searchTerm}
                placeholder="Enter city or location"
                onChange={handleChange}
              />
            </div>
            <div className="price-inputs">
              <div className="input-with-icon">
                <i className="fas fa-rupee-sign"></i>
                <input
                  type="number"
                  name="minPrice"
                  min={0}
                  value={query.minPrice}
                  placeholder="Min Price"
                  onChange={handleChange}
                />
              </div>
              <div className="input-with-icon">
                <i className="fas fa-rupee-sign"></i>
                <input
                  type="number"
                  name="maxPrice"
                  min={0}
                  value={query.maxPrice}
                  placeholder="Max Price"
                  onChange={handleChange}
                />
              </div>
            </div>
            <Link
              to={getSearchUrl()}
              onClick={handleSearch}
              className="search-button"
            >
              <button type="button">
                <i className="fas fa-search"></i>
                <span>Search</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
