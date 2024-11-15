"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface FileImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string; // Image source is required
  fallback?: React.ReactNode; // Fallback content (e.g., icon or placeholder)
  siblings?: React.ReactNode;
}

const FileImage: React.FC<FileImageProps> = ({
  src,
  fallback,
  siblings,
  ...imgProps
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mediaThumbnailError, setMediaThumbnailError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageUrl = src; // Dynamically construct the image URL
        // Simulate an async fetch or check
        const response = await axios.get(imageUrl, { method: "HEAD" });
        if (response.status === 200) {
          setImageSrc(imageUrl);
        } else {
          throw new Error("Image not found");
        }
      } catch (error) {
        setMediaThumbnailError(true); // Set error state if image loading fails
      }
    };

    loadImage(); // Call the async function
  }, [src]);

  return mediaThumbnailError ? (
    fallback
  ) : (
    <>
      <img
        src={imageSrc || ""} // Use the resolved imageSrc or empty string as fallback
        {...imgProps} // Spread the remaining props for the <img> element
      />
      {siblings}
    </>
  );
};

export default FileImage;
