import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const VideoForm = () => {
  const [file, setFile] = useState<File | null>(null); // Store the video file
  const [videoPreview, setVideoPreview] = useState<string | null>(null); // Store the video preview URL
  const [prediction, setPrediction] = useState<string | null>(null); // Store the prediction result
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when file changes or component unmounts
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Create a new object URL for the video
      setVideoPreview(objectUrl);

      // Revoke the previous object URL to avoid memory leaks
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setVideoPreview(null); // If no file, clear the preview
    }
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); // Set the new video file
      setPrediction(null); // Reset the prediction result
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input click
    }
  };

  const handlePrediction = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file); // Send the video file

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict/video", // API endpoint for video prediction
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract the prediction from the response
      const { prediction, real_frames, fake_frames } = response.data;
      setPrediction(
        `Prediction: ${prediction} (Real Frames: ${real_frames}, Fake Frames: ${fake_frames})`
      ); // Set the prediction result
    } catch (error) {
      console.error("Error uploading the video:", error);
      alert("Failed to upload the video or receive prediction.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col pt-5">
            <form>
              <p className="fs-4">Select Video to Predict</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="video/mp4,video/x-m4v,video/*" // Accept video files
                onChange={handleChange}
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={handleButtonClick}
                className="btn btn-dark mt-3 me-3"
              >
                Select Video
              </button>

              <button
                type="button"
                onClick={handlePrediction}
                className="btn btn-dark mt-3"
              >
                Predict
              </button>
            </form>
          </div>

          <div className="col">
            {videoPreview && (
              <video
                controls
                style={{ width: "500px", height: "500px", marginTop: "20px" }}
              >
                <source src={videoPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Display prediction result */}
            {prediction && (
              <div className="mt-4">
                <p className="fs-3">{prediction}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoForm;
