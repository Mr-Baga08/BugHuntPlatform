const XLSX = require('xlsx');
const Task = require("../models/Task");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for Excel files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure multer upload
exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /xlsx|xls|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) and CSV files are allowed'));
    }
  }
}).single('file');

// Process and upload tasks from Excel file
exports.bulkUploadTasks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const updatedBy = req.body.updatedBy || req.user.username || 'Admin';
    
    // Parse the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "The uploaded file contains no data" });
    }
    
    // Validate required columns
    const requiredColumns = ['projectName', 'industry', 'toolLink'];
    const sampleRow = data[0];
    
    const missingColumns = requiredColumns.filter(column => 
      !Object.keys(sampleRow).some(key => key.toLowerCase() === column.toLowerCase())
    );
    
    if (missingColumns.length > 0) {
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: `Missing required columns: ${missingColumns.join(', ')}` 
      });
    }
    
    // Process and validate each row
    const tasksToCreate = [];
    const skippedRows = [];
    const errorRows = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Map column names to our schema (case-insensitive)
      const taskData = {
        projectName: findValueByCaseInsensitiveKey(row, 'projectName'),
        industry: findValueByCaseInsensitiveKey(row, 'industry'),
        toolLink: findValueByCaseInsensitiveKey(row, 'toolLink'),
        Batch: findValueByCaseInsensitiveKey(row, 'batch') || '',
        taskId: findValueByCaseInsensitiveKey(row, 'taskId') || `BH-${Math.floor(1000 + Math.random() * 9000)}`,
        status: findValueByCaseInsensitiveKey(row, 'status') || 'Unclaimed',
        updatedBy: updatedBy,
        lastUpdated: new Date()
      };
      
      // Validate required fields and URL format
      if (!taskData.projectName || !taskData.industry || !taskData.toolLink) {
        errorRows.push({ row: i + 2, reason: 'Missing required fields' });
        continue;
      }
      
      if (!isValidUrl(taskData.toolLink)) {
        errorRows.push({ 
          row: i + 2, 
          reason: 'Invalid URL format. Tool link must start with http:// or https://' 
        });
        continue;
      }
      
      // Validate status enum values
      const validStatuses = ["Unclaimed", "In Progress", "Completed", "Reviewed"];
      if (!validStatuses.includes(taskData.status)) {
        taskData.status = "Unclaimed"; // Default to Unclaimed if invalid
      }
      
      // Check for duplicate taskId
      const existingTask = await Task.findOne({ taskId: taskData.taskId });
      if (existingTask) {
        skippedRows.push({ 
          row: i + 2, 
          reason: `Task with ID ${taskData.taskId} already exists` 
        });
        continue;
      }
      
      tasksToCreate.push(taskData);
    }
    
    // Create tasks in database
    const createdTasks = await Task.insertMany(tasksToCreate);
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    return res.status(201).json({
      message: "Tasks uploaded successfully",
      tasksCreated: createdTasks.length,
      details: {
        created: createdTasks.length,
        skipped: skippedRows.length,
        failed: errorRows.length
      },
      skippedRows,
      errorRows
    });
    
  } catch (error) {
    console.error("Error in bulk task upload:", error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      message: "Failed to process task upload", 
      error: error.message 
    });
  }
};

// Helper function to find a value by case-insensitive key
function findValueByCaseInsensitiveKey(obj, targetKey) {
  const key = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
  return key ? obj[key] : null;
}

// Helper function to validate URL format
function isValidUrl(url) {
  return /^(http|https):\/\//.test(url);
}
