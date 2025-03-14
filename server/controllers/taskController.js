const taskService = require("../Services/taskServices");

exports.createTask = async (req, res) => {
    try {
        // Validate required fields
        const { projectName, industry, toolLink } = req.body;
        if (!projectName || !industry || !toolLink) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Validate URL format if needed
        if (!/^(http|https):\/\//.test(toolLink)) {
            return res.status(400).json({ message: "Tool link must be a valid URL" });
        }
        
        // Add default values if not provided
        const taskData = {
            ...req.body,
            taskId: req.body.taskId || `BH-${Math.floor(1000 + Math.random() * 9000)}`,
            status: req.body.status || "Unclaimed",
            lastUpdated: Date.now()
        };
        
        const task = await taskService.createTask(taskData);
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: error.message });
    }

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.taskId, req.body);
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task updated", updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await taskService.deleteTask(req.params.taskId);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted", deletedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    

exports.updateTaskStatus = async (req, res) => {
    try {
        const { status, updatedBy } = req.body;
        const { taskId } = req.params;
        
        // Validate status
        const allowedStatuses = ["Unclaimed", "In Progress", "Completed", "Reviewed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedTask = await taskService.updateTaskStatus(taskId, status, updatedBy);
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Track task change history
        await taskService.addTaskChange(taskId, status, updatedBy);
        
        res.status(200).json({ 
            message: "Task status updated successfully", 
            updatedTask 
        });
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ error: error.message });
    }
};
