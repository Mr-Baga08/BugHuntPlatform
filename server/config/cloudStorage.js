const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

// In-memory storage for multer
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).fields([
    { name: "scriptFile", maxCount: 1 },
    { name: "supportFile", maxCount: 1 }
]);

// Initialize GridFS
let bucket;
const initBucket = async (req, res, next) => {
    if (!bucket) {
        try {
            // Use the existing mongoose connection
            const db = mongoose.connection.db;
            bucket = new GridFSBucket(db, { bucketName: "uploads" });
        } catch (error) {
            console.error("Error initializing GridFS bucket:", error);
            return res.status(500).json({ error: "Failed to initialize storage" });
        }
    }
    next();
};

// Upload to GridFS directly from memory
const uploadToGridFS = async (req, res, next) => {
    if (!req.files || (!req.files.scriptFile && !req.files.supportFile)) {
        return next();
    }

    if (!bucket) {
        return res.status(500).json({ error: "GridFS Bucket not initialized" });
    }

    const uploadFileToGridFS = (file, fileTypeName) => {
        return new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.originalname, {
                contentType: file.mimetype,
                metadata: {
                    name: Date.now() + "-" + file.originalname,
                    size: file.size,
                    type: file.mimetype,
                    fileTypeName: fileTypeName
                }
            });

            // Write the buffer to the stream
            uploadStream.write(file.buffer);
            uploadStream.end();

            uploadStream.on('finish', () => {
                resolve(uploadStream.id);
            });

            uploadStream.on('error', (error) => {
                reject(error);
            });
        });
    };

    try {
        const uploadedFiles = [];

        if (req.files.scriptFile) {
            const scriptFile = req.files.scriptFile[0];
            const scriptFileId = await uploadFileToGridFS(scriptFile, "scriptFile");
            uploadedFiles.push({ scriptFile: scriptFileId });
        }

        if (req.files.supportFile) {
            const supportFile = req.files.supportFile[0];
            const supportFileId = await uploadFileToGridFS(supportFile, "supportFile");
            uploadedFiles.push({ supportFile: supportFileId });
        }

        req.uploadedFiles = uploadedFiles;
        next();
    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(500).json({ error: "File upload failed" });
    }
};

// Get file from GridFS
const getFileFromGridFS = async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        
        const downloadStream = bucket.openDownloadStream(fileId);
        
        // Set appropriate headers
        downloadStream.on('file', (file) => {
            res.set('Content-Type', file.contentType);
            res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        });
        
        downloadStream.on('error', () => {
            return res.status(404).json({ message: "File not found" });
        });
        
        downloadStream.pipe(res);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { upload, initBucket, uploadToGridFS, getFileFromGridFS };
