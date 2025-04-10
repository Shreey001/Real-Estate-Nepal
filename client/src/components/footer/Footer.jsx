import { Link } from "react-router-dom";
import "./footer.scss";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section company">
          <div className="logo">
            <img src="/logo.png" alt="RealEstate Logo" />
          </div>
          <p className="description">
            Find your dream property with our expert real estate services. We
            help you buy, sell and rent properties with ease.
          </p>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/list">Explore</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/agents">Agents</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>Property Types</h3>
          <ul>
            <li>
              <Link to="/list?type=rent">For Rent</Link>
            </li>
            <li>
              <Link to="/list?type=buy">For Sale</Link>
            </li>
            <li>
              <Link to="/list?featured=true">Featured Properties</Link>
            </li>
            <li>
              <Link to="/list?new=true">New Listings</Link>
            </li>
            <li>
              <Link to="/add">List Your Property</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Real Estate Nepal, Kathmandu, Nepal </span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone-alt"></i>
              <span>+977 9818000000</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>info@realestatenepal.com</span>
            </div>
          </div>
          <div className="newsletter">
            <h4>Subscribe to Newsletter</h4>
            <form className="subscribe-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} Real Estate. All rights reserved.
          </p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
