import { useState, useContext, useEffect, useRef } from "react";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { useNotificationStore } from "../../lib/notificationStore";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      {/* Placeholder div to prevent content jump when navbar becomes fixed */}
      <div className="navbar-placeholder"></div>

      <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
        <nav className="navbar">
          <div className="navbar-logo">
            <Link to="/">
              <img src="/logo.png" alt="RealEstate Logo" />
            </Link>
          </div>

          <div className={`navbar-links ${mobileMenuOpen ? "active" : ""}`}>
            <div className="nav-item">
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </div>

            <div className="nav-item">
              <Link
                to="/list"
                className={location.pathname === "/list" ? "active" : ""}
              >
                Explore
              </Link>
            </div>

            <div className="nav-item">
              <Link
                to="/services"
                className={location.pathname === "/services" ? "active" : ""}
              >
                Services
              </Link>
            </div>

            <div className="nav-item">
              <Link
                to="/agents"
                className={location.pathname === "/agents" ? "active" : ""}
              >
                Agents
              </Link>
            </div>

            <div className="nav-item">
              <Link
                to="/about"
                className={location.pathname === "/about" ? "active" : ""}
              >
                About
              </Link>
            </div>
          </div>

          <div className="navbar-actions">
            {currentUser ? (
              <div className="user-menu-wrapper">
                <div
                  className="user-menu"
                  ref={activeDropdown === "user" ? dropdownRef : null}
                  onClick={() => toggleDropdown("user")}
                >
                  <div className="user-info">
                    <img
                      src={currentUser.avatar || "/default-avatar.png"}
                      alt={currentUser.username}
                      className="user-avatar"
                    />
                    <span className="user-name">{currentUser.username}</span>
                    {number > 0 && (
                      <div className="notification-badge">{number}</div>
                    )}
                    <span className="dropdown-icon">▼</span>
                  </div>

                  {activeDropdown === "user" && (
                    <div className="user-dropdown">
                      <Link to="/profile">
                        <span className="menu-icon">👤</span>
                        My Profile
                      </Link>
                      <Link
                        to="/profile?section=messages"
                        className={
                          location.pathname === "/profile" &&
                          location.search.includes("section=messages")
                            ? "active-section"
                            : ""
                        }
                      >
                        <span className="menu-icon">💬</span>
                        Messages
                        {number > 0 && (
                          <span className="menu-badge">{number}</span>
                        )}
                      </Link>
                      <Link to="/add">
                        <span className="menu-icon">🏠</span>
                        Add Property
                      </Link>
                      <Link to="/profileUpdate">
                        <span className="menu-icon">⚙️</span>
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          // Add logout functionality here
                          console.log("Logout clicked");
                        }}
                      >
                        <span className="menu-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-button">
                  Log In
                </Link>
                <Link to="/register" className="signup-button">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
