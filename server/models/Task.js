const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskId: { type: String, required: true, unique: true }, // Unique Task ID
    projectName: { type: String, required: true },          // Project Name
    industry: { type: String, required: true },
    Batch : {type : String , require:false},             
    toolLink: { type: String, required: false },            // Optional Tool Link
    status: { type: String, required: true, enum: ["Unclaimed", "In Progress", "Completed","Reviewed"] }, // Status Enum
    lastUpdated: { type: Date, default: Date.now },         // Auto-updated timestamp
    updatedBy: { type: String, required: true }             // User who updated it
});

// Export the model
module.exports = mongoose.model("Task", taskSchema);
