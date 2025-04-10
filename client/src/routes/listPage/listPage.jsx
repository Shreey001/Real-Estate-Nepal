import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import List from "../../components/list/List";
import Map from "../../components/map/Map";
import { useLoaderData, Await, useSearchParams } from "react-router-dom";
import { Suspense, useState, useEffect, useMemo } from "react";

function ListPage() {
  const data = useLoaderData();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the current search query if any
  const searchQuery =
    searchParams.get("city") || searchParams.get("searchTerm") || "";

  // Get the listing type (buy, rent, all) - only from 'type' parameter
  const typeParam = searchParams.get("type");
  const listingType =
    typeParam === "buy" || typeParam === "rent" ? typeParam : "all";

  // Get the property type (house, apartment, etc) - from 'property' parameter
  const propertyType = searchParams.get("property") || "";

  // For debugging: log all filter parameters
  useEffect(() => {
    // Track all filter parameters in one place for debugging
    const filterParams = {
      type: searchParams.get("type"),
      effectiveListingType: listingType,
      property: searchParams.get("property"),
      minPrice: searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice"))
        : null,
      maxPrice: searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice"))
        : null,
      bedroom: searchParams.get("bedroom"),
      bathroom: searchParams.get("bathroom"),
      searchTerm: searchParams.get("searchTerm"),
    };

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, listingType]);

  // Reset to list view on smaller screens when component mounts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setViewMode("list"); // Reset to default on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial render

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to toggle between list and map view on mobile
  const toggleView = (mode) => {
    setViewMode(mode);
  };

  // Filter properties based on URL parameters
  const filterProperties = (properties) => {
    if (!properties || !Array.isArray(properties)) return [];

    let filtered = [...properties];

    // Apply listing type filter (buy/rent)
    if (listingType && listingType !== "all") {
      filtered = filtered.filter(
        (property) => property && property.type === listingType
      );
    }

    // Apply property type filter (house, apartment, etc)
    const propertyTypeFilter = searchParams.get("property");
    if (propertyTypeFilter) {
      filtered = filtered.filter(
        (property) => property && property.property === propertyTypeFilter
      );
    }

    // Filter by city/location
    const cityFilter = searchParams.get("city");
    if (cityFilter) {
      const cityLower = cityFilter.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property &&
          property.city &&
          property.city.toLowerCase().includes(cityLower)
      );
    }

    // Filter by price range
    const minPrice = searchParams.get("minPrice");
    if (minPrice) {
      filtered = filtered.filter(
        (property) => property && property.price >= parseInt(minPrice)
      );
    }

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) {
      filtered = filtered.filter(
        (property) => property && property.price <= parseInt(maxPrice)
      );
    }

    // Filter by bedroom count
    const bedrooms = searchParams.get("bedroom");
    if (bedrooms) {
      filtered = filtered.filter(
        (property) => property && property.bedroom >= parseInt(bedrooms)
      );
    }

    // Filter by bathroom count
    const bathrooms = searchParams.get("bathroom");
    if (bathrooms) {
      filtered = filtered.filter(
        (property) => property && property.bathroom >= parseInt(bathrooms)
      );
    }

    // Filter by search term
    const searchTermFilter = searchParams.get("searchTerm");
    if (searchTermFilter) {
      const searchLower = searchTermFilter.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property &&
          ((property.title &&
            property.title.toLowerCase().includes(searchLower)) ||
            (property.address &&
              property.address.toLowerCase().includes(searchLower)) ||
            (property.description &&
              property.description.toLowerCase().includes(searchLower)))
      );
    }

    return filtered;
  };

  // Render function for the property list
  const renderPropertyList = (postResponse) => {
    const filteredProperties = filterProperties(postResponse);

    const resultCount = filteredProperties?.length || 0;

    // Determine what type of listing is being shown
    let listingTypeText = "Properties";
    if (listingType === "buy") listingTypeText = "Properties for Sale";
    if (listingType === "rent") listingTypeText = "Properties for Rent";

    // Add property type to the header if selected
    if (propertyType) {
      const formattedType =
        propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
      listingTypeText = `${formattedType} ${listingTypeText}`;
    }

    return (
      <>
        <div className="listHeader">
          <h2>
            {searchQuery
              ? `${listingTypeText} in "${searchQuery}"`
              : listingTypeText}
          </h2>
          <span className="resultCount">{resultCount} listings</span>
        </div>

        <div className="wrapper">
          <Filter />
          <List posts={filteredProperties} />
        </div>
      </>
    );
  };

  // Render function for the map
  const renderMap = (postResponse) => {
    const filteredProperties = filterProperties(postResponse);
    return <Map items={filteredProperties} />;
  };

  return (
    <div className="listPage">
      <div className="mobileControls">
        <div className="controlButtons">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => toggleView("list")}
          >
            <span className="icon">📋</span> List View
          </button>
          <button
            className={viewMode === "map" ? "active" : ""}
            onClick={() => toggleView("map")}
          >
            <span className="icon">🗺️</span> Map View
          </button>
        </div>
      </div>

      <div className="contentContainer">
        <div
          className={`listContainer ${viewMode === "map" ? "mapActive" : ""}`}
        >
          <Suspense
            fallback={
              <>
                <div className="listHeader">
                  <h2>Loading properties...</h2>
                  <span className="resultCount">0 listings</span>
                </div>
                <div className="wrapper">
                  <Filter />
                  <List loading={true} />
                </div>
              </>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="errorContainer">
                  <p>Error loading properties. Please try again.</p>
                </div>
              }
            >
              {renderPropertyList}
            </Await>
          </Suspense>
        </div>

        <div
          className={`mapContainer ${viewMode === "map" ? "mapActive" : ""}`}
        >
          <Suspense
            fallback={<div className="mapPlaceholder">Loading map...</div>}
          >
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="errorContainer">
                  <p>Error loading map. Please try again.</p>
                </div>
              }
            >
              {renderMap}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;
