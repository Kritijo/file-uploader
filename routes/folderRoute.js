const { Router } = require("express");
const folderRouter = Router();

const folderController = require("../controllers/folderController");

folderRouter.get("/upload-folder", folderController.getFolderUpload);
folderRouter.post("/upload-folder", folderController.postFolderUpload);

folderRouter.get("/folder/:folderId", folderController.viewFolder);
folderRouter.get(
    "/folder/:folderId/upload-folder",
    folderController.getFolderUpload
);

folderRouter.post(
    "/folder/:folderId/upload-folder",
    folderController.postFolderUpload
);

module.exports = folderRouter;
