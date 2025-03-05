const express = require("express");
const router = express.Router();
const { createTaskReview , fetchAllReview} = require("../../controllers/ReviewAndFeedbackControllers/ReviewController");
// // const authenticate = require('../../middleware/authMiddleware')
// // router.post("/create",authenticate, taskReviewController.createTaskReview);
// // router.get("/:taskId",authenticate, taskReviewController.getTaskReviewByTaskId);
// // router.delete("/:id",authenticate, taskReviewController.deleteTaskReview);

// // const express = require("express");
// // const router = express.Router();
// // const taskReviewController = require("../../controllers/ReviewAndFeedbackControllers/ReviewController");
// const { upload } = require("../../config/multerOfConfig");

// // // Create Task Review with Multiple File Uploads
// router.post("/create", upload, taskReviewController.createTaskReview);


const { upload, uploadToGridFS,getFileFromGridFS } = require("../../config/multerOfConfig");

// router.post("/create" ,upload, uploadToGridFS,taskReviewController.createTaskReview);
router.post("/create",
    upload, 
    uploadToGridFS,
    createTaskReview
);
router.get("all-review/:taskId",fetchAllReview);
router.get("/file/:id", getFileFromGridFS);


module.exports = router;

// // // Get Task Review by `taskId`
// // router.get("/:taskId", taskReviewController.getTaskReviewByTaskId);

// // // Delete Task Review by `_id`
// // router.delete("/:id", taskReviewController.deleteTaskReview);

// // // Get File by `fileId`
// // router.get("/file/:fileId", taskReviewController.getFileById);

// // module.exports = router;



// const express = require("express");
// const router = express.Router();
// const taskReviewController = require("../../controllers/ReviewAndFeedbackControllers/ReviewController");
// const { upload } = require("../../config/multerOfConfig");

// // Create Task Review with Multiple File Uploads
// router.post(
//     "/create",
//     upload.fields([{ name: "scriptFile", maxCount: 10 }, { name: "supportFile", maxCount: 10 }]),
//     taskReviewController.createTaskReview
// );

// // Get Task Review by `taskId`
// router.get("/:taskId", taskReviewController.getTaskReviewByTaskId);

// // Delete Task Review by `_id`
// router.delete("/:id", taskReviewController.deleteTaskReview);

// // Get File by `fileId`
// router.get("/file/:fileId", taskReviewController.getFileById);

// module.exports = router;
