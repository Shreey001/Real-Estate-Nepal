import { useState } from "react";
import { Link } from "react-router-dom";
import "./servicesPage.scss";

function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const services = [
    {
      id: 1,
      title: "Property Listings",
      description:
        "List your property for sale or rent with professional photography and detailed descriptions to attract potential buyers or tenants.",
      icon: "🏠",
      category: "selling",
      features: [
        "Professional photography",
        "Virtual tours",
        "Detailed property descriptions",
        "Featured placement options",
      ],
    },
    {
      id: 2,
      title: "Property Management",
      description:
        "Complete property management services including tenant screening, rent collection, maintenance coordination, and financial reporting.",
      icon: "🔑",
      category: "management",
      features: [
        "Tenant screening and placement",
        "Rent collection",
        "Maintenance coordination",
        "Financial reporting",
      ],
    },
    {
      id: 3,
      title: "Home Valuation",
      description:
        "Get an accurate market value assessment of your property based on current market trends and comparable properties in your area.",
      icon: "📊",
      category: "selling",
      features: [
        "Comparative market analysis",
        "Property condition assessment",
        "Location valuation",
        "Future growth potential evaluation",
      ],
    },
    {
      id: 4,
      title: "Buying Assistance",
      description:
        "Personalized buying assistance to help you find and purchase the perfect property that meets your needs and budget.",
      icon: "🔍",
      category: "buying",
      features: [
        "Property search assistance",
        "Neighborhood insights",
        "Negotiation support",
        "Closing coordination",
      ],
    },
    {
      id: 5,
      title: "Mortgage Services",
      description:
        "Connect with trusted lending partners to secure the best possible mortgage rates and terms for your property purchase.",
      icon: "💰",
      category: "financing",
      features: [
        "Rate comparison",
        "Pre-approval assistance",
        "Loan type guidance",
        "Refinancing options",
      ],
    },
    {
      id: 6,
      title: "Legal Services",
      description:
        "Professional legal assistance for all aspects of real estate transactions, including contract review and property title searches.",
      icon: "⚖️",
      category: "legal",
      features: [
        "Contract preparation and review",
        "Title searches",
        "Legal compliance checks",
        "Dispute resolution",
      ],
    },
    {
      id: 7,
      title: "Home Inspection",
      description:
        "Thorough property inspections to identify any potential issues before buying or selling a property.",
      icon: "🔎",
      category: "buying",
      features: [
        "Structural inspection",
        "Systems evaluation",
        "Pest inspection",
        "Safety assessment",
      ],
    },
    {
      id: 8,
      title: "Interior Design",
      description:
        "Professional interior design services to enhance your property's appeal and maximize its value.",
      icon: "🎨",
      category: "enhancement",
      features: [
        "Space planning",
        "Color consultation",
        "Furniture selection",
        "Staging for sale",
      ],
    },
  ];

  const categories = [
    { id: "all", name: "All Services" },
    { id: "buying", name: "Buying" },
    { id: "selling", name: "Selling" },
    { id: "management", name: "Management" },
    { id: "financing", name: "Financing" },
    { id: "legal", name: "Legal" },
    { id: "enhancement", name: "Enhancement" },
  ];

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="hero-content">
          <h1>Our Services</h1>
          <p>Comprehensive real estate solutions tailored to your needs</p>
        </div>
      </div>

      <div className="services-container">
        <div className="services-intro">
          <h2>How We Can Help You</h2>
          <p>
            Whether you're buying, selling, renting, or managing properties, our
            comprehensive suite of services is designed to make your real estate
            experience seamless and successful. Our team of professionals is
            dedicated to providing exceptional service at every step.
          </p>
        </div>

        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? "active" : ""}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="services-grid">
          {filteredServices.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-features">
                <h4>Key Features:</h4>
                <ul>
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <Link to="/contact" className="inquire-button">
                Inquire Now
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Need Personalized Assistance?</h2>
          <p>
            Our team of experts is ready to help you with your unique real
            estate needs.
          </p>
          <div className="cta-buttons">
            <Link to="/contact" className="primary-button">
              Contact Us
            </Link>
            <Link to="/agents" className="secondary-button">
              Meet Our Agents
            </Link>
          </div>
        </div>
      </div>

      <div className="testimonial-section">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-card">
          <div className="quote-icon">"</div>
          <p className="testimonial-text">
            The property management services have been exceptional. They've
            taken all the stress out of being a landlord, and my properties have
            never been better maintained.
          </p>
          <div className="testimonial-author">
            <img src="/testimonials/person1.png" alt="Client" />
            <div>
              <h4>Anish Acharya</h4>
              <p>Property Owner, Kathmandu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I list my property for sale?</h3>
            <p>
              You can list your property by creating an account, clicking on
              "Add Property" in your profile menu, and filling out the property
              details form. Our team will review and publish your listing within
              24 hours.
            </p>
          </div>
          <div className="faq-item">
            <h3>What fees are associated with your services?</h3>
            <p>
              Our fee structure varies depending on the service. Basic listings
              are free, while premium services like professional photography and
              featured placements have additional costs. Property management
              services typically charge a percentage of the monthly rent.
            </p>
          </div>
          <div className="faq-item">
            <h3>How long does it take to sell a property?</h3>
            <p>
              The timeline varies based on location, property type, condition,
              and market conditions. On average, properties listed with us sell
              within 45-60 days, which is faster than the market average.
            </p>
          </div>
          <div className="faq-item">
            <h3>Do you offer services outside major cities?</h3>
            <p>
              Yes, we provide services across all regions. Our network of agents
              covers both urban and rural areas to ensure comprehensive support
              regardless of property location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
