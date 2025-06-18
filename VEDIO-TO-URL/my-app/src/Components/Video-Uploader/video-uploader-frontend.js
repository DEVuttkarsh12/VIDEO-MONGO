// import React, { useState } from "react";
// import axios from "axios";

// function VideoUploader() {
//   const [video, setVideo] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [url, setUrl] = useState("");

//   const handleVideoChange = (e) => {
//     setVideo(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!video) return alert("Please select a video");

//     const formData = new FormData();
//     formData.append("video", video);

//     setUploading(true);

//     try {
//       const res = await axios.post("http://localhost:5000/upload", formData);
//       setUrl(res.data.url);
//     } catch (err) {
//       console.error("Upload error:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Upload a Video</h2>
//       <input type="file" accept="video/*" onChange={handleVideoChange} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? "Uploading..." : "Upload Video"}
//       </button>
//       {url && (
//         <div>
//           <h3>Video URL:</h3>
//           <a href={url} target="_blank" rel="noopener noreferrer">
//             {url}
//           </a>
//           <video controls width="400" src={url}></video>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoUploader;

import React, { useState } from "react";
import axios from "axios";

function VideoUploader() {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video) return alert("Please select a video");

    const formData = new FormData();
    formData.append("video", video);

    setUploading(true);
    setSuccess(false);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      setSuccess(true); // just show success message, no URL
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload a Video</h2>
      <input type="file" accept="video/*" onChange={handleVideoChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {success && (
        <p style={{ color: "green" }}>✅ Video uploaded successfully!</p>
      )}
    </div>
  );
}

export default VideoUploader;
