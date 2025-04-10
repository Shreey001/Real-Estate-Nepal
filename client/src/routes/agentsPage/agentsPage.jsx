import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./agentsPage.scss";
import apiRequest from "../../lib/apiRequest";

function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Filter agents based on search term only
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

    setFilteredAgents(result);
  }, [searchTerm, agents]);

  return (
    <div className="agents-page">
      <div className="agents-hero">
        <div className="hero-content">
          <h1>Meet Our Agents</h1>
          <p>
            Expert professionals ready to help with all your real estate needs
          </p>
        </div>
      </div>

      <div className="agents-container">
        <div className="agents-intro">
          <h2>Our Team of Experts</h2>
          <p>
            Our experienced agents combine local knowledge with industry
            expertise to provide exceptional service. Whether you're buying,
            selling, or investing, our team is committed to making your real
            estate journey successful.
          </p>
        </div>

        <div className="agents-filter-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, location or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading agents...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="no-results">
            <h3>No agents found</h3>
            <p>Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
              }}
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="agents-grid">
            {filteredAgents.map((agent) => (
              <div className="agent-card" key={agent.id}>
                <div className="agent-image">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    onError={(e) => {
                      e.target.src = "/default-agent.jpg";
                    }}
                  />
                </div>
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p className="agent-role">{agent.role}</p>
                  <div className="agent-location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    </svg>
                    <span>{agent.location}</span>
                  </div>
                  <div className="agent-experience">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                    </svg>
                    <span>{agent.experience} years experience</span>
                  </div>
                  <div className="agent-stats">
                    <div className="stat">
                      <span className="value">{agent.listings}</span>
                      <span className="label">Listings</span>
                    </div>
                    <div className="stat">
                      <span className="value">{agent.reviews}</span>
                      <span className="label">Rating</span>
                    </div>
                  </div>
                  <div className="agent-buttons">
                    <button
                      className="view-profile"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      View Profile
                    </button>
                    <a href={`mailto:${agent.email}`} className="contact">
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAgent && (
        <div
          className="agent-modal-overlay"
          onClick={() => setSelectedAgent(null)}
        >
          <div className="agent-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setSelectedAgent(null)}
            >
              &times;
            </button>

            <div className="agent-modal-content">
              <div className="agent-profile-header">
                <div className="agent-profile-image">
                  <img
                    src={selectedAgent.photo}
                    alt={selectedAgent.name}
                    onError={(e) => {
                      e.target.src = "/default-agent.jpg";
                    }}
                  />
                </div>
                <div className="agent-profile-intro">
                  <h2>{selectedAgent.name}</h2>
                  <p className="agent-profile-role">{selectedAgent.role}</p>
                  <div className="agent-contact-info">
                    <div className="contact-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      </svg>
                      <span>{selectedAgent.phone}</span>
                    </div>
                    <div className="contact-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 1-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                      </svg>
                      <span>{selectedAgent.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="agent-profile-details">
                <div className="profile-section">
                  <h3>About {selectedAgent.name.split(" ")[0]}</h3>
                  <p>{selectedAgent.bio}</p>
                </div>

                <div className="profile-section">
                  <h3>Areas Served</h3>
                  <div className="areas-list">
                    {selectedAgent.areas.map((area, index) => (
                      <div className="area-tag" key={index}>
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Languages</h3>
                  <div className="languages-list">
                    {selectedAgent.languages.map((language, index) => (
                      <div className="language-tag" key={index}>
                        {language}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Achievements</h3>
                  <ul className="achievements-list">
                    {selectedAgent.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                {selectedAgent.joinedDate && (
                  <div className="profile-section">
                    <h3>Member Since</h3>
                    <p>
                      {new Date(selectedAgent.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="agent-profile-actions">
                <a
                  href={`mailto:${selectedAgent.email}`}
                  className="email-agent"
                >
                  Email Agent
                </a>
                <a
                  href={`tel:${selectedAgent.phone.replace(/\s+/g, "")}`}
                  className="call-agent"
                >
                  Call Agent
                </a>
                <Link
                  to={`/list?agent=${selectedAgent.id}`}
                  className="view-listings"
                >
                  View Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="join-team-section">
        <div className="join-team-content">
          <h2>Join Our Team</h2>
          <p>
            Are you a passionate real estate professional looking to take your
            career to the next level? We're always looking for talented
            individuals to join our team.
          </p>
          <Link to="/careers" className="join-button">
            Learn About Careers
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AgentsPage;
