import { useState, useContext, useEffect, useRef } from "react";
import "./navbar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../lib/notificationStore";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, updateUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle logo click - scroll to top if on homepage
  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Placeholder div to prevent content jump when navbar becomes fixed */}
      <div className="navbar-placeholder"></div>

      <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
        <nav className="navbar">
          <div className="navbar-logo">
            <Link to="/" onClick={handleLogoClick}>
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

            {/* Mobile-only login/signup buttons */}
            {!currentUser && (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="login-button">
                  Log In
                </Link>
                <Link to="/register" className="signup-button">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="navbar-actions">
            {currentUser ? (
              <div className="profile-menu-container">
                <div
                  className="profile-menu-trigger"
                  ref={activeDropdown === "user" ? dropdownRef : null}
                  onClick={() => toggleDropdown("user")}
                >
                  <div className="profile-avatar-wrapper">
                    <img
                      src={currentUser.avatar || "/default-avatar.png"}
                      alt={currentUser.username}
                      className="profile-avatar"
                    />
                    {number > 0 && (
                      <div className="notification-indicator"></div>
                    )}
                  </div>
                  <span className="profile-name">{currentUser.username}</span>
                  <span
                    className={`dropdown-chevron ${
                      activeDropdown === "user" ? "active" : ""
                    }`}
                  >
                    <svg
                      width="12"
                      height="7"
                      viewBox="0 0 12 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  {activeDropdown === "user" && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <img
                          src={currentUser.avatar || "/default-avatar.png"}
                          alt={currentUser.username}
                          className="dropdown-avatar"
                        />
                        <div className="dropdown-user-info">
                          <h4>{currentUser.username}</h4>
                          <span className="user-email">
                            {currentUser.email || "user@example.com"}
                          </span>
                        </div>
                      </div>

                      <div className="dropdown-menu-items">
                        <Link to="/profile" className="dropdown-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/profile?section=messages"
                          className="dropdown-item"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.9965 11H16.0054"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.9955 11H12.0045"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.99451 11H8.00349"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Messages</span>
                          {number > 0 && (
                            <div className="menu-badge">{number}</div>
                          )}
                        </Link>

                        <Link to="/add" className="dropdown-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 22H22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.94995 22L2.99995 9.97C2.99995 9.36 3.28995 8.78 3.76995 8.4L10.77 2.95C11.49 2.39 12.4999 2.39 13.2299 2.95L20.2299 8.39C20.7199 8.77 20.9999 9.35 20.9999 9.97V22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 22V16C15 15.45 14.55 15 14 15H10C9.45 15 9 15.45 9 16V22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13 9.5H11C10.45 9.5 10 9.95 10 10.5V12.5C10 13.05 10.45 13.5 11 13.5H13C13.55 13.5 14 13.05 14 12.5V10.5C14 9.95 13.55 9.5 13 9.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Add Property</span>
                        </Link>

                        <Link to="/profileUpdate" className="dropdown-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22.01 10.07 22.01 11.12V12.88C22.01 13.92 21.16 14.78 20.11 14.78C18.3 14.78 17.56 16.06 18.47 17.63C18.99 18.54 18.68 19.7 17.77 20.22L16.04 21.21C15.25 21.68 14.23 21.4 13.76 20.61L13.65 20.42C12.75 18.85 11.27 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Settings</span>
                        </Link>

                        <div className="dropdown-divider"></div>

                        <button
                          onClick={handleLogout}
                          className="dropdown-item logout-item"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.90002 7.56023C9.21002 3.96023 11.06 2.49023 15.11 2.49023H15.24C19.71 2.49023 21.5 4.28023 21.5 8.75023V15.2702C21.5 19.7402 19.71 21.5302 15.24 21.5302H15.11C11.09 21.5302 9.24002 20.0802 8.91002 16.5402"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 12H3.62"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.85 8.65039L2.5 12.0004L5.85 15.3504"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
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
