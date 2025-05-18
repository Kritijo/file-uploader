const fileController = require("../controllers/fileController");
const { Router } = require("express");
const fileRouter = Router();

fileRouter.get("/upload-file", fileController.getFileUpload);
fileRouter.post("/upload-file", fileController.postFileUpload);

fileRouter.get("/uploads/:fileUrl", fileController.viewFile);
fileRouter.post("/delete-file/:id", fileController.deleteFile);

module.exports = fileRouter;
