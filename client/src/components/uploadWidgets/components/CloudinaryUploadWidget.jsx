import { useEffect, useRef } from "react";

const CloudinaryUploadWidget = ({ uwConfig, onUploadSuccess }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    // Check if Cloudinary is available
    if (window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;

      // Initialize the upload widget
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          // Required parameters
          cloudName: uwConfig.cloudName,
          uploadPreset: uwConfig.uploadPreset,

          // Optional parameters
          folder: uwConfig.folder || "avatars",
          multiple: uwConfig.multiple || false,
          maxImageFileSize: uwConfig.maxImageFileSize || 3000000,
          cropping: uwConfig.cropping,
          showAdvancedOptions: uwConfig.showAdvancedOptions || false,
          sources: uwConfig.sources || ["local", "url", "camera"],
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            // When upload is successful, call the callback with the result

            if (onUploadSuccess) {
              onUploadSuccess(result.info.public_id, result.info.secure_url);
            }
          }

          if (error) {
            console.error("Upload error:", error);
          }
        }
      );
    } else {
      console.error(
        "Cloudinary SDK not loaded. Check if the script is included in your HTML."
      );
    }
  }, [uwConfig, onUploadSuccess]);

  const handleOnClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.error("Upload widget is not initialized");
    }
  };

  return (
    <button onClick={handleOnClick} className="cloudinary-button" type="button">
      Upload Image
    </button>
  );
};

export default CloudinaryUploadWidget;
