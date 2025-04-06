import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import UploadWidgets from "../../components/uploadWidgets/UploadWidgets";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Set the avatar when the component mounts to ensure currentUser is available
  useEffect(() => {
    if (currentUser && currentUser.avatar) {
      setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const updateData = {
        username,
        email,
        password,
        avatar: avatar[0],
      };

      // Only include password if it's not empty
      if (password) {
        updateData.password = password;
      }

      // Include avatar if it has changed
      if (avatar && avatar !== currentUser.avatar) {
        updateData.avatar = avatar;
      }

      console.log("Updating user with data:", updateData);
      const res = await apiRequest.put(`/users/${currentUser.id}`, updateData);
      updateUser(res.data);
      navigate("/profile");
    } catch (error) {
      console.error("Update error:", error);
      setError(
        error.response?.data?.message || "An error occurred during update"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not loaded yet, show a loading message
  if (!currentUser) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username || ""}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email || ""}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Leave empty to keep current password"
            />
          </div>
          <button disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.png"}
          alt="Profile avatar"
          className="avatar"
        />
        <UploadWidgets
          uwConfig={{
            cloudName: "dqiqotjg4",
            uploadPreset: "estatw",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
