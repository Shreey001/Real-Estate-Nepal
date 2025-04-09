import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./locationPicker.scss";
import L from "leaflet";

// Fix for Leaflet's default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map clicks
function MapClickHandler({ setPosition, initialPosition, mapRef }) {
  const map = useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (initialPosition && initialPosition[0] && initialPosition[1]) {
      map.flyTo(initialPosition, map.getZoom());
    }

    // Store map reference
    if (mapRef) {
      mapRef.current = map;
    }
  }, [initialPosition, map, mapRef]);

  return null;
}

function LocationPicker({ onSelectLocation, initialLat, initialLng }) {
  const [position, setPosition] = useState(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const [address, setAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState({
    city: "",
    neighborhood: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const geocodeTimeoutRef = useRef(null);
  const mapRef = useRef(null);
  const locationDataRef = useRef({
    latitude: initialLat || null,
    longitude: initialLng || null,
    address: "",
    city: "",
    neighborhood: "",
  });
  const defaultCenter = [40.7128, -74.006]; // Default to New York

  // Memoized function to notify parent of changes
  const notifyParent = useCallback(() => {
    if (position && locationDataRef.current) {
      onSelectLocation(locationDataRef.current);
    }
  }, [onSelectLocation, position]);

  // Geocode the coordinates to get an address
  useEffect(() => {
    if (!position) return;

    // Update location data
    locationDataRef.current = {
      ...locationDataRef.current,
      latitude: position[0],
      longitude: position[1],
    };

    // Notify parent of changes
    notifyParent();

    // Clear any existing timeout
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }

    // Set a new timeout to avoid too many API calls
    geocodeTimeoutRef.current = setTimeout(() => {
      fetchAddress(position[0], position[1]);
    }, 500);

    // Cleanup function
    return () => {
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
    };
  }, [position, notifyParent]);

  // When address changes, update ref and notify parent
  useEffect(() => {
    locationDataRef.current = {
      ...locationDataRef.current,
      address: address,
      city: addressDetails.city,
      neighborhood: addressDetails.neighborhood,
    };

    // Only call if we have position to avoid unnecessary updates
    if (position) {
      notifyParent();
    }
  }, [address, addressDetails, position, notifyParent]);

  // Effect to initialize with initial coordinates
  useEffect(() => {
    if (initialLat && initialLng && position) {
      locationDataRef.current = {
        latitude: initialLat,
        longitude: initialLng,
        address: address,
        city: addressDetails.city,
        neighborhood: addressDetails.neighborhood,
      };
    }
  }, [initialLat, initialLng, position, address, addressDetails]);

  // Helper function to extract city and neighborhood from address data
  const extractAddressComponents = (addressData) => {
    const details = { city: "", neighborhood: "" };

    if (!addressData || !addressData.address) {
      return details;
    }

    const addr = addressData.address;

    // Try to get city from various fields
    details.city =
      addr.city || addr.town || addr.village || addr.county || addr.state || "";

    // Try to get neighborhood
    details.neighborhood =
      addr.suburb || addr.neighbourhood || addr.district || addr.quarter || "";

    return details;
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "RealEstateAppLocationPicker/1.0",
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) {
        console.warn("Reverse geocoding response status:", response.status);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.display_name) {
        setAddress(data.display_name);

        // Extract and set city and neighborhood info
        const details = extractAddressComponents(data);
        setAddressDetails(details);
      } else {
        setAddress("Address not found");
        setAddressDetails({ city: "", neighborhood: "" });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error retrieving address");
      setAddressDetails({ city: "", neighborhood: "" });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    searchLocation();
  };

  const searchLocation = async () => {
    if (!searchInput.trim()) return;

    setSearchError("");
    setIsSearching(true);

    try {
      const encodedQuery = encodeURIComponent(searchInput.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "RealEstateAppLocationPicker/1.0",
          "Accept-Language": "en",
        },
      });

      if (!response.ok) {
        console.warn("Search response status:", response.status);
        if (response.status === 429) {
          throw new Error("Too many requests. Please try again in a moment.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);

        // Fly to the location
        if (mapRef.current) {
          mapRef.current.flyTo([parsedLat, parsedLon], 13);
        }

        setPosition([parsedLat, parsedLon]);
        setAddress(display_name);

        // Extract and set city and neighborhood info
        const details = extractAddressComponents(data[0]);
        setAddressDetails(details);
      } else {
        setSearchError(
          "No locations found. Please try a different search term."
        );
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchError(
        error.message || "Error searching for location. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="location-picker">
      <div className="search-container">
        <div className="search-form">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter city, address or landmark..."
            disabled={isSearching}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchInput.trim()}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {searchError && <div className="search-error">{searchError}</div>}

      <MapContainer
        center={position || defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler
          setPosition={setPosition}
          initialPosition={position}
          mapRef={mapRef}
        />
        {position && <Marker position={position} />}
      </MapContainer>

      {position && (
        <div className="selected-location">
          <p>
            <strong>Selected Coordinates:</strong> Lat: {position[0].toFixed(6)}
            , Lng: {position[1].toFixed(6)}
          </p>
          {address && (
            <p>
              <strong>Address:</strong> {address}
            </p>
          )}
          {addressDetails.city && (
            <p>
              <strong>City:</strong> {addressDetails.city}
            </p>
          )}
          {addressDetails.neighborhood && (
            <p>
              <strong>Neighborhood:</strong> {addressDetails.neighborhood}
            </p>
          )}
        </div>
      )}

      <div className="map-info">
        Click anywhere on the map to select a location or use the search box
        above.
      </div>
    </div>
  );
}

export default LocationPicker;
