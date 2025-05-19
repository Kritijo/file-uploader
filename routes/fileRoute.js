const fileController = require("../controllers/fileController");
const { Router } = require("express");
const fileRouter = Router();

fileRouter.get("/upload-file", fileController.getFileUpload);
fileRouter.post("/upload-file", fileController.postFileUpload);

fileRouter.get("/files/:id", fileController.viewFile);
fileRouter.post("/delete-file/:id", fileController.deleteFile);

fileRouter.get("/download/:id", fileController.downloadFile);

fileRouter.get("/folder/:folderId/upload-file", fileController.getFileUpload);
fileRouter.post("/folder/:folderId/upload-file", fileController.postFileUpload);

module.exports = fileRouter;
