import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import { useNavigate, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useContext, Suspense, useState, useEffect } from "react";
import { useLoaderData, Await } from "react-router-dom";

function ProfilePage() {
  const { postResponse, chatResponse } = useLoaderData();
  const { currentUser, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("myProperties");
  const [chatOpen, setChatOpen] = useState(window.innerWidth > 1200);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1200) {
        setChatOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const renderList = (resolvedData, type) => {
    if (!resolvedData || !resolvedData.data) {
      return <div className="emptyState">No data available</div>;
    }

    const posts =
      type === "user"
        ? resolvedData.data.userPosts
        : resolvedData.data.savedPosts;
    if (!posts || !Array.isArray(posts)) {
      return <div className="emptyState">No properties available</div>;
    }

    return <List posts={posts} />;
  };

  return (
    <div className="profilePage">
      {/* Main Content Area with Profile Header */}
      <div className="mainContentWithProfile">
        {/* Profile Header */}
        <div className="profileHeader">
          <div className="userInfo">
            <div className="avatar">
              <img
                src={currentUser?.avatar || "/default-avatar.png"}
                alt={currentUser?.username}
              />
            </div>
            <div className="userDetails">
              <h2>{currentUser?.username}</h2>
              <p>{currentUser?.email}</p>
            </div>
          </div>

          <div className="actions">
            <Link to="/add" className="createButton">
              Create New Listing
            </Link>
            <Link to="/profileUpdate" className="editButton">
              Edit Profile
            </Link>
            <button onClick={handleLogout} className="logoutButton">
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabNavigation">
          <button
            className={`tab ${activeTab === "myProperties" ? "active" : ""}`}
            onClick={() => setActiveTab("myProperties")}
          >
            <span className="icon">🏠</span>
            My Properties
          </button>
          <button
            className={`tab ${activeTab === "savedProperties" ? "active" : ""}`}
            onClick={() => setActiveTab("savedProperties")}
          >
            <span className="icon">💾</span>
            Saved Properties
          </button>
          {/* Only show Messages toggle on tablet/mobile */}
          {windowWidth <= 1200 && (
            <button
              className={`tab ${chatOpen ? "active" : ""}`}
              onClick={toggleChat}
            >
              <span className="icon">💬</span>
              Messages
            </button>
          )}
        </div>

        {/* Property Content */}
        <div className="propertyContent">
          <Suspense
            fallback={<div className="loading">Loading properties...</div>}
          >
            <Await
              resolve={postResponse}
              errorElement={
                <div className="error">Error Loading Properties</div>
              }
            >
              {(resolvedData) =>
                renderList(
                  resolvedData,
                  activeTab === "myProperties" ? "user" : "saved"
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`chatPanel ${chatOpen ? "open" : ""}`}>
        <div className="chatHeader">
          <h2>Messages</h2>
          {windowWidth <= 1200 && (
            <button className="closeChat" onClick={() => setChatOpen(false)}>
              ×
            </button>
          )}
        </div>
        <div className="chatContainer">
          <Suspense
            fallback={<div className="loading">Loading conversations...</div>}
          >
            <Await
              resolve={chatResponse}
              errorElement={<div className="error">Error Loading Chats</div>}
            >
              {(chatResponse) => {
                console.log("Chat data in profile:", chatResponse.data);
                return <Chat chats={chatResponse.data || []} />;
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Mobile Toggle for Chat */}
      <div className="mobileActions">
        <button className="mobileToggleChat" onClick={toggleChat}>
          {chatOpen ? "Close Messages" : "Open Messages"}
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
