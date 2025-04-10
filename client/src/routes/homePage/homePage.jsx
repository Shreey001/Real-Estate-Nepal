import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialCarouselRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Anish Acharya",
      photo: "/testimonials/person1.png",
      quote:
        "Found my dream apartment in Kathmandu through this platform. The process was smooth and the agent was extremely helpful!",
      location: "Kathmandu",
      role: "Small Business Owner",
      date: "January 5, 2023",
      rating: 5,
    },
    {
      id: 2,
      name: "Kiran Parajuli",
      photo: "/testimonials/person2.png",
      quote:
        "I was able to sell my property within weeks of listing. The exposure and quality of interested buyers was impressive.",
      location: "Pokhara",
      role: "Property Investor",
      date: "March 18, 2023",
      rating: 4,
    },
    {
      id: 3,
      name: "Shreeyjan",
      photo: "/testimonials/person3.png",
      quote:
        "The real estate agents were knowledgeable and helped me find exactly what I was looking for within my budget.",
      location: "Lalitpur",
      role: "Individual Consumer",
      date: "December 10, 2023",
      rating: 5,
    },
    {
      id: 4,
      name: "Ujjwal Bhandarii",
      photo: "/testimonials/person4.png",
      quote:
        "The platform made house hunting so much easier. I could filter properties according to my needs and connect directly with sellers.",
      location: "Bhaktapur",
      role: "First-time Buyer",
      date: "February 20, 2023",
      rating: 5,
    },
    {
      id: 5,
      name: "Uttam Aryal",
      photo: "/testimonials/person5.png",
      quote:
        "As a landlord, this platform has helped me find reliable tenants quickly. The verification process gives me peace of mind.",
      location: "Kathmandu",
      role: "Property Owner",
      date: "July 7, 2023",
      rating: 4,
    },
    {
      id: 6,
      name: "Anish Acharya",
      photo: "/testimonials/person1.png",
      quote:
        "Found my dream apartment in Kathmandu through this platform. The process was smooth and the agent was extremely helpful!",
      location: "Kathmandu",
      role: "Small Business Owner",
      date: "January 5, 2023",
      rating: 5,
    },
    {
      id: 7,
      name: "Shreeyjan",
      photo: "/testimonials/person3.png",
      quote:
        "Found my dream apartment in Kathmandu through this platform. The process was smooth and the agent was extremely helpful!",
      location: "Kathmandu",
      role: "Small Business Owner",
      date: "January 5, 2023",
      rating: 5,
    },
    {
      id: 8,
      name: "Ujjwal Bhandarii",
      photo: "/testimonials/person4.png",
      quote:
        "Found my dream apartment in Kathmandu through this platform. The process was smooth and the agent was extremely helpful!",
      location: "Kathmandu",
      role: "Small Business Owner",
      date: "January 5, 2023",
      rating: 5,
    },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        setActiveTestimonial((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 2000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [testimonials.length]);

  // Handle manual navigation
  const handleTestimonialNavigation = (direction) => {
    // Reset auto-scroll timer when manually navigating
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    if (direction === "prev") {
      setActiveTestimonial((prev) =>
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
    } else {
      setActiveTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }

    // Restart auto-scroll after manual navigation
    autoScrollIntervalRef.current = setInterval(() => {
      setActiveTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 3000);
  };

  // Scroll the carousel when activeTestimonial changes
  useEffect(() => {
    if (testimonialCarouselRef.current) {
      const carouselWidth = testimonialCarouselRef.current.offsetWidth;
      const cardWidth = carouselWidth * 0.3; // Approximate card width (30% of container)

      // Calculate position based on card width and gap
      const scrollPosition = activeTestimonial * (cardWidth + 20); // 20px is the gap between cards

      testimonialCarouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "auto",
      });
    }
  }, [activeTestimonial]);

  // Category data with image paths
  const categories = [
    {
      id: 1,
      name: "House",
      image: "/categories/house.png",
      description: "Standalone residential buildings",
      link: "/list?property=house",
    },
    {
      id: 2,
      name: "Apartment",
      image: "/categories/apartment.png",
      description: "Units in multi-family buildings",
      link: "/list?property=apartment",
    },
    {
      id: 3,
      name: "Condo",
      image: "/categories/condo.png",
      description: "Privately owned units in shared buildings",
      link: "/list?property=condo",
    },
    {
      id: 4,
      name: "Land",
      image: "/categories/land.png",
      description: "Undeveloped plots for construction",
      link: "/list?property=land",
    },
  ];

  // Popular locations data
  const popularLocations = [
    {
      id: 1,
      name: "Kathmandu",
      image: "/locations/kathmandu.png",
      description: "Capital City",
      link: "/list?city=kathmandu",
    },
    {
      id: 2,
      name: "Pokhara",
      image: "/locations/pokhara.png",
      description: "Lake City",
      link: "/list?city=pokhara",
    },
    {
      id: 3,
      name: "Bhaktapur",
      image: "/locations/bhaktapur.png",
      description: "City of Fine Arts",
      link: "/list?city=bhaktapur",
    },
    {
      id: 4,
      name: "Butwal",
      image: "/locations/butwal.png",
      description: "Ancient City",
      link: "/list?city=butwal",
    },
  ];

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? "filled" : "empty"}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="homePage">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="textContainer">
            <div className="wrapper">
              <h1 className="title">Find Your Dream Property in Nepal</h1>
              <p className="subtitle">
                Discover thousands of properties for sale and rent across Nepal.
                From modern apartments to traditional homes, find the perfect
                place to call your own.
              </p>
              <div className="search-container">
                <SearchBar />
              </div>
              <div className="boxes">
                <div className="box">
                  <h1>16+</h1>
                  <h2>Years of Experience</h2>
                </div>
                <div className="box">
                  <h1>200+</h1>
                  <h2>Awards Received</h2>
                </div>
                <div className="box">
                  <h1>2000+</h1>
                  <h2>Properties Listed</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Category Section */}
      <section className="category-section">
        <div className="section-container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-description">
            Explore different types of properties available for sale and rent
          </p>
          <div className="category-cards">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="category-card"
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations Section */}
      <section className="locations-section">
        <div className="section-container">
          <h2 className="section-title">Popular Locations</h2>
          <p className="section-description">
            Discover properties in the most sought-after cities in Nepal
          </p>
          <div className="location-cards">
            {popularLocations.map((location) => (
              <Link
                key={location.id}
                to={location.link}
                className="location-card"
              >
                <img src={location.image} alt={location.name} />
                <div className="location-info">
                  <h3>{location.name}</h3>
                  <p>{location.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">TESTIMONIALS</h2>
          <p className="section-description">
            Hear from people who found their perfect property through our
            platform
          </p>

          <div className="testimonial-carousel-container">
            <button
              className="testimonial-nav-button prev"
              onClick={() => handleTestimonialNavigation("prev")}
              aria-label="Previous testimonial"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="testimonial-carousel" ref={testimonialCarouselRef}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`testimonial-card ${
                    index === activeTestimonial ? "active" : ""
                  }`}
                >
                  <div className="testimonial-image">
                    <img src={testimonial.photo} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-card-inner">
                    <p className="testimonial-quote">{testimonial.quote}</p>
                    <h4 className="user-name">{testimonial.name}</h4>
                    <p className="user-role">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="testimonial-nav-button next"
              onClick={() => handleTestimonialNavigation("next")}
              aria-label="Next testimonial"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === activeTestimonial ? "active" : ""
                }`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="section-container cta-container">
          <div className="cta-content">
            <h2>Have a Property to Sell or Rent?</h2>
            <p>
              List your property with us and reach thousands of potential buyers
              and tenants. Our platform offers maximum visibility and connects
              you with serious clients.
            </p>
            <div className="cta-buttons">
              <Link to="/add" className="cta-primary-btn">
                List Your Property
              </Link>
              <Link to="/services" className="cta-secondary-btn">
                Learn More
              </Link>
            </div>
          </div>
          <div className="cta-image">
            <img src="/cta-property.png" alt="List your property" />
          </div>
        </div>
      </section>
    </div>
  );
}
