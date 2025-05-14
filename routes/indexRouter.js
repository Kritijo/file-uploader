const { Router } = require("express");
const indexRouter = Router();

const homeController = require("../controllers/homeController");
const formController = require("../controllers/formController");
const signUpValidation = require("../config/signUpValidation");

indexRouter.get("/", homeController.getHome);

indexRouter.get("/signup", formController.getSignUp);
indexRouter.post("/signup", signUpValidation, formController.postSignUp);

indexRouter.get("/login", formController.getLogIn);
indexRouter.post("/login", formController.postLogIn);
indexRouter.get("/logout", formController.logOut);

indexRouter.get("/upload", formController.getUpload);
indexRouter.post("/upload", formController.postUpload);

indexRouter.get("/uploads/:fileUrl", formController.viewFile);

module.exports = indexRouter;
