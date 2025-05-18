const { Router } = require("express");
const authRouter = Router();

const formController = require("../controllers/formController");
const signUpValidation = require("../config/signUpValidation");

authRouter.get("/signup", formController.getSignUp);
authRouter.post("/signup", signUpValidation, formController.postSignUp);

authRouter.get("/login", formController.getLogIn);
authRouter.post("/login", formController.postLogIn);
authRouter.get("/logout", formController.logOut);

module.exports = authRouter;
