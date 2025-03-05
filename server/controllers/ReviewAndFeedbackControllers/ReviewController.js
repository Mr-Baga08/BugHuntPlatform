const TaskReview = require("../../models/TaskReview/TaskReviewAndFeedback");



// Create Task Review with File Uploads
exports.createTaskReview = async (req, res) => {
    try {

        const { taskId, observedBehavior, vulnerabilities, reviewBy } = req.body;
        if (!req.files || (!req.files["scriptFile"] && !req.files["supportFile"])) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        const scriptFiles = req.uploadedFiles[0]["scriptFile"]
        const supportFiles = req.uploadedFiles[1]["supportFile"]
        console.log(supportFiles)
        // Check if file IDs exist
        if (scriptFiles.length === 0) {
            return res.status(500).json({ error: "Script file upload failed" });
        }
        console.log(scriptFiles)
        const taskReview = new TaskReview({
            taskId,
            scriptId: [], // Assuming scripts are referenced separately
            scriptFile: scriptFiles || null, // Store first file reference
            supportFile: supportFiles || null,
            observedBehavior,
            vulnerabilities,
            reviewBy
        });

        await taskReview.save();
        res.status(201).json({ message: "Task review created successfully", taskReview });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.fetchAllReview = async(req,res)=>{
    try{
        
        const allTask = await TaskReview.find({taskId:req.params.taskId});
        res.status(201).json({message:"all task fetch successfully", allTask});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

