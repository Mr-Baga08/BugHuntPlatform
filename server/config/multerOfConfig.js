const multer = require("multer");
const { MongoClient, GridFSBucket } = require("mongodb");
const fs = require("fs");
const path = require("path");

async function connectDB() {
  const client = await MongoClient.connect("mongodb+srv://fk7483136:sXRU8XqBhHJjI6sC@astraeus.04jjs.mongodb.net/files", { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to MongoDB");
  return client;
}

let bucket;
async function initializeDB() {
  try {
    const client = await connectDB();
    const db = client.db("mongodb_gridfs");
    bucket = new GridFSBucket(db, { bucketName: "myBucketName" });
    console.log("GridFS Bucket initialized");
  } catch (error) {
    console.error("Error initializing GridFS:", error);
  }
}

initializeDB();

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads"); // Temporary upload folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ✅ Upload Middleware for Two Files
const upload = multer({
  storage,
}).fields([
  { name: "scriptFile", maxCount: 1 },
  { name: "supportFile", maxCount: 1 },
]);

// ✅ Upload Files to GridFS with Metadata (file1 and file2)
const uploadToGridFS = async (req, res, next) => {
//   console.log("Inside uploadToGridFS middleware");
//   console.log("Bucket Status:", bucket);
  
  if (!req.files || (!req.files.scriptFile && !req.files.supportFile)) {
    return res.status(400).json({ error: "Both files are required." });
  }

  if (!bucket) {
    return res.status(500).json({ error: "GridFS Bucket not initialized" });
  }

  const uploadFileToGridFS = (file, fileTypeName) => {
    return new Promise((resolve, reject) => {
      const filePath = file.path;
      const fileName = file.filename;

      const stream = fs.createReadStream(filePath)
        .pipe(
          bucket.openUploadStream(fileName, {
            chunkSizeBytes: 1048576, // 1 MB
            metadata: {
              name: Date.now() + "-" + file.originalname,
              size: file.size,
              type: file.mimetype,
              fileTypeName: fileTypeName, // Adding "file1" or "file2"
            },
          })
        );

      stream.on("finish", () => {
        fs.unlinkSync(filePath); // Delete local file after upload
        resolve(stream.id);
      });

      stream.on("error", (err) => {
        console.error("GridFS Upload Error:", err);
        reject(err);
      });
    });
  };

  try {
    const uploadedFiles = [];

    if (req.files.scriptFile) {
      const scriptFile = req.files.scriptFile[0];
      const scriptFileName = await uploadFileToGridFS(scriptFile, "scriptFile");
      uploadedFiles.push({ scriptFile: scriptFileName });
    }

    if (req.files.supportFile) {
      const supportFile = req.files.supportFile[0];
      const supportFileName = await uploadFileToGridFS(supportFile, "supportFile");
      uploadedFiles.push({ supportFile: supportFileName });
    }

    console.log("Uploaded Files:", uploadedFiles);
    req.uploadedFiles = uploadedFiles;
    console.log("Moving to next middleware (createTaskReview)");
    // next(); // ✅ Move to next middleware (taskReviewController.createTaskReview)
  } catch (error) {
    console.error("Error uploading files:", error);
    // next(error); // ✅ Pass the error to Express error handler
  }
  next();
};


const getFileFromGridFS = async (req, res) => {
    try {
      const fileId = new mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "scriptFile", // Ensure this matches your upload bucket name
      });
  
      const downloadStream = bucket.openDownloadStream(fileId);
  
      downloadStream.on("error", (err) => {
        res.status(404).json({ message: "File not found" });
      });
  
      res.set("Content-Type", "application/octet-stream");
      downloadStream.pipe(res);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = { upload, uploadToGridFS, getFileFromGridFS };
