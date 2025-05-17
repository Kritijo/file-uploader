const { Router } = require("express");
const indexRouter = Router();

const homeController = require("../controllers/homeController");
const formController = require("../controllers/formController");
const signUpValidation = require("../config/signUpValidation");
const fileController = require("../controllers/fileController");
const folderController = require("../controllers/folderController");

indexRouter.get("/", homeController.getHome);

indexRouter.get("/signup", formController.getSignUp);
indexRouter.post("/signup", signUpValidation, formController.postSignUp);

indexRouter.get("/login", formController.getLogIn);
indexRouter.post("/login", formController.postLogIn);
indexRouter.get("/logout", formController.logOut);

indexRouter.get("/upload-file", fileController.getFileUpload);
indexRouter.post("/upload-file", fileController.postFileUpload);

indexRouter.get("/uploads/:fileUrl", fileController.viewFile);
indexRouter.post("/delete-file/:id", fileController.deleteFile);

indexRouter.get("/upload-folder", folderController.getFolderUpload);
indexRouter.post("/upload-folder", folderController.postFolderUpload);

indexRouter.get("/folder/:folderId", folderController.viewFolder);

module.exports = indexRouter;
