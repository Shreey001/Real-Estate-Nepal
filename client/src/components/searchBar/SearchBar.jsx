import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";
const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
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
    if (query.type) params.append("type", query.type);
    if (query.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query.minPrice) params.append("minPrice", query.minPrice);
    if (query.maxPrice) params.append("maxPrice", query.maxPrice);
    return `/list?${params.toString()}`;
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="searchTerm"
          value={query.searchTerm}
          placeholder="Enter city or location (e.g. New York, Manhattan)"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          value={query.minPrice}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          value={query.maxPrice}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link to={getSearchUrl()}>
          <button type="button">
            <img src="/search.png" alt="Search" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
