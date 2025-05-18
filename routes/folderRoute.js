const { Router } = require("express");
const folderRouter = Router();

const folderController = require("../controllers/folderController");

folderRouter.get("/upload-folder", folderController.getFolderUpload);
folderRouter.post("/upload-folder", folderController.postFolderUpload);

folderRouter.get("/folder/:folderId", folderController.viewFolder);

module.exports = folderRouter;
