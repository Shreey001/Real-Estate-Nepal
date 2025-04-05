import { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

import CloudinaryUploadWidget from "./components/CloudinaryUploadWidget";
import "./uploadwidgets.scss";

const UploadWidgets = ({ setAvatar, uwConfig }) => {
  // Configuration
  const cloudName = uwConfig?.cloudName || "dqiqotjg4";
  const uploadPreset = uwConfig?.uploadPreset || "estatw";

  // State
  const [publicId, setPublicId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Cloudinary configuration
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  // Default Upload Widget Configuration
  const defaultConfig = {
    cloudName,
    uploadPreset,
    multiple: false,
    folder: "avatars",
  };

  // Use provided config or default
  const widgetConfig = uwConfig || defaultConfig;

  // Handle upload success
  const handleUploadSuccess = (publicId, url) => {
    setPublicId(publicId);
    setImageUrl(url);
    if (setAvatar && url) {
      setAvatar(url);
    }
  };

  return (
    <div className="upload-widget-container">
      <CloudinaryUploadWidget
        uwConfig={widgetConfig}
        onUploadSuccess={handleUploadSuccess}
      />

      {imageUrl && (
        <div className="image-preview">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadWidgets;
