import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./agentsPage.scss";
import apiRequest from "../../lib/apiRequest";
import {
  FiMapPin,
  FiSearch,
  FiMessageSquare,
  FiAward,
  FiStar,
  FiHome,
  FiX,
  FiFilter,
} from "react-icons/fi";

function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState("grid");
  const [selectedSort, setSelectedSort] = useState("rating");
  const searchRef = useRef(null);

  // Fetch agents from the API
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await apiRequest.get("/users/agents");
        setAgents(response.data);
        setFilteredAgents(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError("Failed to load agents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Filter agents based on search term
  useEffect(() => {
    if (!agents.length) return;

    let result = agents;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (agent) =>
          agent.name.toLowerCase().includes(term) ||
          agent.location.toLowerCase().includes(term) ||
          agent.areas.some((area) => area.toLowerCase().includes(term))
      );
    }

    // Sort results
    if (selectedSort === "rating") {
      result = [...result].sort((a, b) => b.reviews - a.reviews);
    } else if (selectedSort === "experience") {
      result = [...result].sort((a, b) => b.experience - a.experience);
    } else if (selectedSort === "listings") {
      result = [...result].sort((a, b) => b.listings - a.listings);
    }

    setFilteredAgents(result);
  }, [searchTerm, agents, selectedSort]);

  const handleSearchFocus = () => {
    if (searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  return (
    <div className="agents-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Connect with Top Real Estate Agents</h1>
          <p>
            Discover experienced professionals to guide your property journey
          </p>

          <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, location or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>
                  <FiX />
                </button>
              )}
            </div>
            <button
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter />
              <span>Filter</span>
            </button>
          </div>

          {showFilters && (
            <div className="filter-options">
              <div className="filter-group">
                <h3>Sort by</h3>
                <div className="radio-options">
                  <label className={selectedSort === "rating" ? "active" : ""}>
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === "rating"}
                      onChange={() => setSelectedSort("rating")}
                    />
                    <span>Rating</span>
                  </label>
                  <label
                    className={selectedSort === "experience" ? "active" : ""}
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === "experience"}
                      onChange={() => setSelectedSort("experience")}
                    />
                    <span>Experience</span>
                  </label>
                  <label
                    className={selectedSort === "listings" ? "active" : ""}
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === "listings"}
                      onChange={() => setSelectedSort("listings")}
                    />
                    <span>Listings</span>
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <h3>View</h3>
                <div className="view-options">
                  <button
                    className={selectedView === "grid" ? "active" : ""}
                    onClick={() => setSelectedView("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={selectedView === "list" ? "active" : ""}
                    onClick={() => setSelectedView("list")}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="agents-container">
        <div className="agents-header">
          <h2>Our Expert Agents</h2>
          <p className="results-count">
            {filteredAgents.length} agent
            {filteredAgents.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Finding the perfect agents for you...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration"></div>
            <h3>No agents match your search</h3>
            <p>Try adjusting your search criteria or browse all our agents</p>
            <button onClick={() => setSearchTerm("")}>View All Agents</button>
          </div>
        ) : (
          <div className={`agents-${selectedView}`}>
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className={`agent-card ${
                  selectedView === "list" ? "list-view" : ""
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="agent-photo">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    onError={(e) => {
                      e.target.src = "/default-agent.jpg";
                    }}
                  />
                  {agent.featured && (
                    <span className="featured-badge">Featured</span>
                  )}
                </div>

                <div className="agent-details">
                  <h3>{agent.name}</h3>
                  <p className="agent-title">{agent.role}</p>

                  <div className="agent-location">
                    <FiMapPin />
                    <span>{agent.location}</span>
                  </div>

                  <div className="agent-stats">
                    <div className="stat">
                      <FiAward />
                      <span>
                        {agent.experience}{" "}
                        {agent.experience === 1 ? "year" : "years"}
                      </span>
                    </div>
                    <div className="stat">
                      <FiHome />
                      <span>
                        {agent.listings}{" "}
                        {agent.listings === 1 ? "listing" : "listings"}
                      </span>
                    </div>
                    <div className="stat rating">
                      <FiStar />
                      <span>
                        {typeof agent.reviews === "number"
                          ? agent.reviews.toFixed(1)
                          : agent.reviews}
                      </span>
                    </div>
                  </div>

                  {selectedView === "list" && (
                    <p className="agent-bio">
                      {agent.bio?.substring(0, 120)}...
                    </p>
                  )}

                  <div className="agent-actions">
                    <button className="view-profile">View Profile</button>
                    <button className="contact-agent">
                      <FiMessageSquare />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAgent && (
        <div
          className="agent-profile-modal"
          onClick={() => setSelectedAgent(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setSelectedAgent(null)}
            >
              <FiX />
            </button>

            <div className="modal-header">
              <div className="agent-profile-photo">
                <img
                  src={selectedAgent.photo}
                  alt={selectedAgent.name}
                  onError={(e) => {
                    e.target.src = "/default-agent.jpg";
                  }}
                />
              </div>

              <div className="agent-profile-info">
                <h2>{selectedAgent.name}</h2>
                <p className="agent-role">{selectedAgent.role}</p>

                <div className="agent-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={
                          i < Math.round(selectedAgent.reviews) ? "filled" : ""
                        }
                      />
                    ))}
                  </div>
                  <span>
                    {typeof selectedAgent.reviews === "number"
                      ? selectedAgent.reviews.toFixed(1)
                      : selectedAgent.reviews}{" "}
                    ({selectedAgent.reviewCount || 0} reviews)
                  </span>
                </div>

                <div className="agent-badges">
                  <span className="badge">
                    <FiAward />
                    {selectedAgent.experience}{" "}
                    {selectedAgent.experience === 1 ? "year" : "years"}{" "}
                    experience
                  </span>
                  <span className="badge">
                    <FiHome />
                    {selectedAgent.listings} property listings
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="section-content">
                <h3>About</h3>
                <p>{selectedAgent.bio || "No bio available for this agent."}</p>
              </div>

              <div className="section-content">
                <h3>Areas Served</h3>
                <div className="areas-list">
                  {selectedAgent.areas?.map((area, index) => (
                    <span key={index} className="area-tag">
                      {area}
                    </span>
                  )) || <p>No areas specified</p>}
                </div>
              </div>

              <div className="section-content">
                <h3>Specializations</h3>
                <div className="specializations-list">
                  {selectedAgent.specializations?.map((spec, index) => (
                    <span key={index} className="spec-tag">
                      {spec}
                    </span>
                  )) || <p>No specializations specified</p>}
                </div>
              </div>

              <div className="section-content">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Email:</strong> {selectedAgent.email}
                  </div>
                  <div className="contact-item">
                    <strong>Phone:</strong> {selectedAgent.phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Link
                to={`/list?agent=${selectedAgent.id}`}
                className="view-listings"
              >
                View Agent Listings
              </Link>
              <a href={`mailto:${selectedAgent.email}`} className="email-agent">
                Send Email
              </a>
              <a
                href={`tel:${selectedAgent.phone?.replace(/\s+/g, "")}`}
                className="call-agent"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="testimonials-section">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p>
              Our agent went above and beyond to help us find our dream home.
              The entire process was smooth and painless.
            </p>
            <div className="testimonial-author">
              <img
                src="/testimonials/person1.png"
                alt="Client"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div>
                <h4>Sarah Johnson</h4>
                <span>First-time Homebuyer</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p>
              Selling our property was easier than we expected. Professional
              service and great communication throughout.
            </p>
            <div className="testimonial-author">
              <img
                src="/testimonials/person2.png"
                alt="Client"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div>
                <h4>Michael Patel</h4>
                <span>Property Seller</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p>
              As an investor, I needed an agent who understood market trends.
              The expertise provided was invaluable.
            </p>
            <div className="testimonial-author">
              <img
                src="/testimonials/person3.png"
                alt="Client"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div>
                <h4>Jennifer Kim</h4>
                <span>Property Investor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="join-team-section">
        <div className="join-team-content">
          <h2>Join Our Expert Team</h2>
          <p>
            Are you a passionate real estate professional looking to advance
            your career? We offer a supportive environment, cutting-edge tools,
            and the opportunity to grow with an industry leader.
          </p>
          <div className="join-benefits">
            <div className="benefit">
              <div className="benefit-icon">🚀</div>
              <h3>Career Growth</h3>
              <p>
                Advance your real estate career with our comprehensive training
                and mentorship programs.
              </p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">💼</div>
              <h3>Top Listings</h3>
              <p>
                Gain access to exclusive high-value property listings and a wide
                client network.
              </p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🌟</div>
              <h3>Support Team</h3>
              <p>
                Work with a dedicated team that helps you succeed every step of
                the way.
              </p>
            </div>
          </div>
          <Link to="/careers" className="join-button">
            Explore Career Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AgentsPage;
