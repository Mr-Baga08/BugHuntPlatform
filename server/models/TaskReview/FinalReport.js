const mongoose = require("mongoose");

const FinalReportSchema = new mongoose.Schema({
    taskId: { type: String, required: true, unique: true }, // Unique taskId to ensure one report per task
    reportSummary: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ["Easy", "Medium", "Hard"] },
    updatedBy: { type: String, required: true }, // Stores who last updated the report
    lastUpdated: { type: Date, default: Date.now } // Stores last update timestamp
});

module.exports = mongoose.model("FinalReport", FinalReportSchema);
