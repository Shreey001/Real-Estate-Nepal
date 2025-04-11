import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import UploadWidgets from "../../components/uploadWidgets/UploadWidgets";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");

    if (!currentUser || !currentUser.id) {
      setError("User session expired. Please login again.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      // Create update data object with required fields
      const updateData = {
        username: username.trim(),
        email: email.trim(),
      };

      // Only include password if it's not empty
      if (password && password.trim() !== "") {
        updateData.password = password;
      }

      // Include avatar if it has changed and is valid
      if (avatar && avatar !== currentUser.avatar) {
        updateData.avatar = avatar;
      }

      const res = await apiRequest.put(`/users/${currentUser.id}`, updateData);

      // Update the local user data with the response
      const updatedUser = {
        ...currentUser,
        ...res.data,
      };
      updateUser(updatedUser);

      setSuccessMessage("Profile updated successfully!");
      // Navigate after a short delay to show the success message
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
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

          <div className="formActions">
            <Link to="/profile" className="cancelButton">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar || currentUser.avatar || "/noavatar.png"}
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
        <p className="uploadHint">Tap to upload a new profile picture</p>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
