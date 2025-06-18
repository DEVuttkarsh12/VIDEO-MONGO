// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cors = require("cors");
// const fs = require("fs");
// const { v2: cloudinary } = require("cloudinary");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // MongoDB connection
// // mongoose.connect("mongodb://localhost:27017/vedios-db", {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });

// // // Video schema
// // const videoSchema = new mongoose.Schema({
// //   videoUrl: String,
// //   uploadedAt: { type: Date, default: Date.now },
// // });
// // const Video = mongoose.model("vedios", videoSchema); // collection name = vedios

// mongoose.connect("mongodb://localhost:27017/videos-db", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const videoSchema = new mongoose.Schema({
//   videoUrl: String,
//   uploadedAt: { type: Date, default: Date.now },
// });

// // ✅ Force collection name to be exactly 'videos'
// const Video = mongoose.model("Video", videoSchema, "videos");

// app.post("/upload", upload.single("video"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "video",
//     });

//     console.log("Cloudinary Result:", result.secure_url); // <== ✅ DEBUG

//     const newVideo = new Video({ videoUrl: result.secure_url });
//     await newVideo.save();

//     fs.unlinkSync(req.file.path);

//     res.status(200).json({ message: "Video uploaded" });
//   } catch (err) {
//     console.error("Upload Error:", err.message);
//     res.status(500).json({ error: "Upload failed", details: err.message });
//   }
// });

// app.listen(5000, () =>
//   console.log("🚀 Server running on http://localhost:5000")
// );

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer middleware for handling video uploads
const upload = multer({ dest: "uploads/" });

// ✅ MongoDB connection
mongoose.connect("mongodb://localhost:27017/videos-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Video schema & model (collection: 'videos')
const videoSchema = new mongoose.Schema({
  videoUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});
const Video = mongoose.model("Video", videoSchema, "videos");

// ✅ Upload route
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    console.log("Cloudinary Result:", result.secure_url); // ✅ Confirm upload

    const newVideo = new Video({ videoUrl: result.secure_url });
    await newVideo
      .save()
      .then(() => console.log("✅ Video URL saved to MongoDB"))
      .catch((err) => console.error("❌ MongoDB Save Error:", err.message));

    fs.unlinkSync(req.file.path); // ✅ Clean up temp file

    res.status(200).json({ message: "Video uploaded" });
  } catch (err) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ✅ Start the server
app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
