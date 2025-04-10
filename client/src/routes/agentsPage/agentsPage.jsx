import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./agentsPage.scss";

function AgentsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Agent data
  const agents = [
    {
      id: 1,
      name: "Rajesh Sharma",
      photo: "/testimonials/person1.png",
      role: "Senior Real Estate Agent",
      specialization: "Residential",
      location: "Kathmandu",
      experience: 12,
      languages: ["English", "Nepali", "Hindi"],
      email: "rajesh.sharma@realestate.com",
      phone: "+977 9801234567",
      bio: "Rajesh has been helping families find their dream homes in Kathmandu for over 12 years. With his deep knowledge of the local market and excellent negotiation skills, he consistently delivers outstanding results for his clients.",
      listings: 48,
      reviews: 4.9,
      areas: ["Kathmandu", "Lalitpur", "Bhaktapur"],
      achievements: ["Top Seller 2021", "Customer Excellence Award"],
    },
    {
      id: 2,
      name: "Priya Thapa",
      photo: "/testimonials/person2.png",
      role: "Luxury Property Specialist",
      specialization: "Luxury",
      location: "Lalitpur",
      experience: 8,
      languages: ["English", "Nepali"],
      email: "priya.thapa@realestate.com",
      phone: "+977 9802345678",
      bio: "Specializing in luxury properties throughout Lalitpur and surrounding areas, Priya brings elegance and professionalism to every transaction. Her attention to detail and personalized approach make her the go-to agent for discerning clients.",
      listings: 26,
      reviews: 4.8,
      areas: ["Lalitpur", "Babarmahal", "Jhamsikhel"],
      achievements: ["Luxury Sales Leader", "International Property Award"],
    },
    {
      id: 3,
      name: "Santosh Gurung",
      photo: "/testimonials/person3.png",
      role: "Commercial Real Estate Expert",
      specialization: "Commercial",
      location: "Kathmandu",
      experience: 15,
      languages: ["English", "Nepali", "Chinese"],
      email: "santosh.gurung@realestate.com",
      phone: "+977 9803456789",
      bio: "With 15 years of commercial real estate experience, Santosh has a proven track record of facilitating successful transactions for businesses of all sizes. His knowledge of market trends and investment strategies helps clients make informed decisions.",
      listings: 37,
      reviews: 4.7,
      areas: ["New Baneshwor", "Tinkune", "Thapathali"],
      achievements: ["Commercial Agent of the Year", "Million Dollar Club"],
    },
    {
      id: 4,
      name: "Asha Maharjan",
      photo: "/testimonials/person4.png",
      role: "First-Time Buyer Specialist",
      specialization: "Residential",
      location: "Bhaktapur",
      experience: 6,
      languages: ["English", "Nepali", "Newari"],
      email: "asha.maharjan@realestate.com",
      phone: "+977 9804567890",
      bio: "Asha is passionate about helping first-time homebuyers navigate the complex process of purchasing their first property. Her patient guidance and extensive knowledge of financing options make her an invaluable resource for new buyers.",
      listings: 31,
      reviews: 4.9,
      areas: ["Bhaktapur", "Thimi", "Katunje"],
      achievements: ["Rookie of the Year", "Client Satisfaction Award"],
    },
    {
      id: 5,
      name: "Kamal Rai",
      photo: "/testimonials/person5.png",
      role: "Investment Property Advisor",
      specialization: "Investment",
      location: "Pokhara",
      experience: 10,
      languages: ["English", "Nepali"],
      email: "kamal.rai@realestate.com",
      phone: "+977 9805678901",
      bio: "Kamal specializes in investment properties with a focus on rental yields and capital growth. His analytical approach and deep understanding of market cycles help investors build profitable real estate portfolios.",
      listings: 42,
      reviews: 4.6,
      areas: ["Pokhara", "Lakeside", "Sarangkot"],
      achievements: ["Investment Guru Award", "Property Portfolio Excellence"],
    },
    {
      id: 6,
      name: "Nisha Shrestha",
      photo: "/testimonials/person2.png",
      role: "New Development Specialist",
      specialization: "New Developments",
      location: "Kathmandu",
      experience: 7,
      languages: ["English", "Nepali", "French"],
      email: "nisha.shrestha@realestate.com",
      phone: "+977 9806789012",
      bio: "Focusing on new developments and off-plan properties, Nisha helps clients secure the best units in upcoming projects. Her relationships with developers provide clients with exclusive access and preferential terms.",
      listings: 23,
      reviews: 4.8,
      areas: ["Budhanilkantha", "Tokha", "Balaju"],
      achievements: ["Development Sales Leader", "Project Launch Specialist"],
    },
    {
      id: 7,
      name: "Bikash Tamang",
      photo: "/testimonials/person3.png",
      role: "Land Acquisition Expert",
      specialization: "Land",
      location: "Kathmandu Valley",
      experience: 13,
      languages: ["English", "Nepali", "Tamang"],
      email: "bikash.tamang@realestate.com",
      phone: "+977 9807890123",
      bio: "Bikash is a specialist in land transactions across the Kathmandu Valley. His extensive network and knowledge of zoning regulations and development potential make him invaluable for those looking to purchase land for either personal or commercial purposes.",
      listings: 35,
      reviews: 4.7,
      areas: ["Kathmandu Valley", "Nagarkot", "Chandragiri"],
      achievements: ["Land Transaction Expert", "Rural Development Pioneer"],
    },
    {
      id: 8,
      name: "Sunita Basnet",
      photo: "/testimonials/person4.png",
      role: "Rental Property Manager",
      specialization: "Rentals",
      location: "Lalitpur",
      experience: 9,
      languages: ["English", "Nepali"],
      email: "sunita.basnet@realestate.com",
      phone: "+977 9808901234",
      bio: "Sunita excels in connecting tenants with the perfect rental properties while helping landlords maximize their returns. Her property management expertise ensures smooth operations and happy tenants for her portfolio of managed properties.",
      listings: 56,
      reviews: 4.8,
      areas: ["Patan", "Sanepa", "Pulchowk"],
      achievements: [
        "Rental Management Excellence",
        "Tenant Satisfaction Leader",
      ],
    },
  ];

  // Specialization filters
  const specializations = [
    { id: "all", name: "All Agents" },
    { id: "Residential", name: "Residential" },
    { id: "Commercial", name: "Commercial" },
    { id: "Luxury", name: "Luxury" },
    { id: "Investment", name: "Investment" },
    { id: "Land", name: "Land" },
    { id: "New Developments", name: "New Developments" },
    { id: "Rentals", name: "Rentals" },
  ];

  // Filter agents based on specialization and search term
  useEffect(() => {
    let result = agents;

    // Filter by specialization
    if (activeFilter !== "all") {
      result = result.filter((agent) => agent.specialization === activeFilter);
    }

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
  }, [activeFilter, searchTerm]);

  // Initialize filtered agents on component mount
  useEffect(() => {
    setFilteredAgents(agents);
  }, []);

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

          <div className="specialization-filters">
            {specializations.map((specialization) => (
              <button
                key={specialization.id}
                className={activeFilter === specialization.id ? "active" : ""}
                onClick={() => setActiveFilter(specialization.id)}
              >
                {specialization.name}
              </button>
            ))}
          </div>
        </div>

        {filteredAgents.length === 0 ? (
          <div className="no-results">
            <h3>No agents found</h3>
            <p>
              Try adjusting your search criteria or select a different
              specialization
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setSearchTerm("");
              }}
            >
              Reset Filters
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
                  <h3>Specializations</h3>
                  <div className="specialization-tag">
                    {selectedAgent.specialization}
                  </div>
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
