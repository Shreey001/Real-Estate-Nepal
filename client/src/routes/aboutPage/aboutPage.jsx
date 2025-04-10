import { useState } from "react";
import { Link } from "react-router-dom";
import "./aboutPage.scss";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("story");

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Sharma Yug",
      position: "Founder & CEO",
      photo: "/testimonials/person1.png",
      bio: "Founded the company in 2018 with a vision to transform the real estate market in Nepal through technology and transparency.",
    },
    {
      id: 2,
      name: "Priya Thapa",
      position: "Head of Operations",
      photo: "/testimonials/person2.png",
      bio: "Leads our day-to-day operations ensuring smooth functioning across all departments.",
    },
    {
      id: 3,
      name: "Bikash Tamang",
      position: "Chief Technology Officer",
      photo: "/testimonials/person3.png",
      bio: "Oversees our technology infrastructure and drives innovation in our digital platforms.",
    },
    {
      id: 4,
      name: "Asha Maharjan",
      position: "Marketing Director",
      photo: "/testimonials/person4.png",
      bio: "Crafts our brand message and leads strategic marketing initiatives to reach new audiences.",
    },
    {
      id: 5,
      name: "Rajesh Sharma",
      position: "Senior Real Estate Advisor",
      photo: "/testimonials/person5.png",
      bio: "Brings over 15 years of industry experience to guide our strategic approach to the market.",
    },
    {
      id: 6,
      name: "Nisha Shrestha",
      position: "Customer Success Manager",
      photo: "/testimonials/person2.png",
      bio: "Ensures our clients receive exceptional service throughout their real estate journey.",
    },
  ];

  // Company values
  const values = [
    {
      id: 1,
      title: "Transparency",
      description:
        "We believe in complete transparency in all our dealings, providing clear information to help clients make informed decisions.",
      icon: "🔍",
    },
    {
      id: 2,
      title: "Innovation",
      description:
        "We constantly innovate to provide cutting-edge solutions that make real estate transactions easier and more efficient.",
      icon: "💡",
    },
    {
      id: 3,
      title: "Integrity",
      description:
        "We operate with the highest level of integrity, ensuring that our clients' interests are always our top priority.",
      icon: "🤝",
    },
    {
      id: 4,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from customer service to the technology we develop.",
      icon: "⭐",
    },
    {
      id: 5,
      title: "Community",
      description:
        "We are committed to giving back to the communities we serve, supporting local initiatives and sustainable development.",
      icon: "🏙️",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <h1>About Us</h1>
          <p>
            Transforming real estate experiences through innovation and
            expertise
          </p>
        </div>
      </div>

      <div className="about-container">
        <div className="about-tabs">
          <button
            className={activeTab === "story" ? "active" : ""}
            onClick={() => setActiveTab("story")}
          >
            Our Story
          </button>
          <button
            className={activeTab === "mission" ? "active" : ""}
            onClick={() => setActiveTab("mission")}
          >
            Mission & Vision
          </button>
          <button
            className={activeTab === "team" ? "active" : ""}
            onClick={() => setActiveTab("team")}
          >
            Our Team
          </button>
          <button
            className={activeTab === "values" ? "active" : ""}
            onClick={() => setActiveTab("values")}
          >
            Our Values
          </button>
        </div>

        <div className="about-content">
          {activeTab === "story" && (
            <div className="about-story">
              <div className="section-intro">
                <h2>Our Journey</h2>
                <p>
                  Founded in 2018, our real estate platform was born from a
                  simple observation: the traditional real estate market in
                  Nepal was fragmented, lacked transparency, and was difficult
                  to navigate for both buyers and sellers.
                </p>
                <p>
                  Our founder, Sharma Yug, experienced these challenges
                  firsthand when searching for his own home. Recognizing the
                  need for a more efficient and transparent approach, he
                  assembled a team of real estate professionals and technology
                  experts to create a platform that would transform the way
                  properties are bought, sold, and rented in Nepal.
                </p>
              </div>

              <div className="story-image">
                <img src="/office.png" alt="Our Office" />
                <div className="image-caption">
                  Our headquarters in Kathmandu
                </div>
              </div>
            </div>
          )}

          {activeTab === "mission" && (
            <div className="mission-vision">
              <div className="mission-section">
                <div className="section-icon">🎯</div>
                <h2>Our Mission</h2>
                <p>
                  To revolutionize the real estate industry in Nepal by
                  providing a transparent, efficient, and user-friendly platform
                  that connects property buyers, sellers, and renters while
                  delivering exceptional value through innovative technology and
                  personalized service.
                </p>
              </div>

              <div className="vision-section">
                <div className="section-icon">🔭</div>
                <h2>Our Vision</h2>
                <p>
                  To be the most trusted and innovative real estate platform in
                  Nepal, setting new standards for the industry and empowering
                  people to make better property decisions through technology,
                  data, and expertise.
                </p>
              </div>

              <div className="goals-section">
                <h3>Strategic Goals</h3>
                <div className="goals-grid">
                  <div className="goal-item">
                    <h4>Market Leadership</h4>
                    <p>
                      Become the #1 real estate platform in Nepal by transaction
                      volume and user satisfaction.
                    </p>
                  </div>
                  <div className="goal-item">
                    <h4>Technological Innovation</h4>
                    <p>
                      Continuously develop and implement cutting-edge
                      technologies to improve the real estate experience.
                    </p>
                  </div>
                  <div className="goal-item">
                    <h4>Community Building</h4>
                    <p>
                      Foster a community of informed property owners, buyers,
                      and professionals through education and networking.
                    </p>
                  </div>
                  <div className="goal-item">
                    <h4>Sustainable Growth</h4>
                    <p>
                      Grow strategically while maintaining our commitment to
                      quality service and responsible business practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="team-section">
              <div className="section-intro">
                <h2>Meet Our Leadership Team</h2>
                <p>
                  Our success is driven by our dedicated team of professionals
                  who bring diverse expertise and a shared passion for
                  transforming the real estate experience.
                </p>
              </div>

              <div className="team-grid">
                {teamMembers.map((member) => (
                  <div className="team-member" key={member.id}>
                    <div className="member-photo">
                      <img
                        src={member.photo}
                        alt={member.name}
                        onError={(e) => {
                          e.target.src = "/team/default.jpg";
                        }}
                      />
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <div className="position">{member.position}</div>
                      <p>{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="join-team">
                <h3>Join Our Team</h3>
                <p>
                  We're always looking for talented individuals who share our
                  vision and values. Explore current opportunities and become
                  part of our growing team.
                </p>
                <Link to="/careers" className="careers-button">
                  View Open Positions
                </Link>
              </div>
            </div>
          )}

          {activeTab === "values" && (
            <div className="values-section">
              <div className="section-intro">
                <h2>The Principles That Guide Us</h2>
                <p>
                  Our core values define who we are and how we operate. They
                  guide our decisions, shape our culture, and drive our
                  commitment to excellence in everything we do.
                </p>
              </div>

              <div className="values-grid">
                {values.map((value) => (
                  <div className="value-card" key={value.id}>
                    <div className="value-icon">{value.icon}</div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                ))}
              </div>

              <div className="approach-section">
                <h3>Our Approach</h3>
                <div className="approach-content">
                  <div className="approach-text">
                    <p>
                      At the heart of our approach is a deep understanding of
                      both the real estate market and the unique needs of our
                      clients. We combine industry expertise with technological
                      innovation to create solutions that address real
                      challenges and deliver tangible benefits.
                    </p>
                    <p>
                      We believe that real estate is more than just
                      transactions—it's about helping people find places where
                      they can live, work, and thrive. This perspective informs
                      everything we do, from the features we develop to the
                      service we provide.
                    </p>
                  </div>
                  <div className="approach-image">
                    <img src="/approach.png" alt="Our Approach" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Work With Us?</h2>
          <p>
            Discover how our platform and expertise can help you achieve your
            real estate goals.
          </p>
          <div className="cta-buttons">
            <Link to="/services" className="primary-button">
              Explore Our Services
            </Link>
            <Link to="/contact" className="secondary-button">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
