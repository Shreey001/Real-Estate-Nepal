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

  // Get the current search query if any
  const searchQuery =
    searchParams.get("city") || searchParams.get("searchTerm") || "";

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

  // Render function for the property list
  const renderPropertyList = (postResponse) => {
    const resultCount = postResponse?.length || 0;

    return (
      <>
        <div className="listHeader">
          <h2>
            {searchQuery ? `Properties in "${searchQuery}"` : "All Properties"}
          </h2>
          <span className="resultCount">{resultCount} listings</span>
        </div>

        <div className="wrapper">
          <Filter />
          <List posts={postResponse} />
        </div>
      </>
    );
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
                <div className="mapPlaceholder">Error loading map</div>
              }
            >
              {(postResponse) => <Map items={postResponse} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;
