const { Router } = require("express");
const indexRouter = Router();

const homeController = require("../controllers/homeController");

indexRouter.get("/", homeController.getHome);

const authRouter = require("./authRoute");
const fileRouter = require("./fileRoute");
const folderRouter = require("./folderRoute");

indexRouter.use("/", authRouter);
indexRouter.use("/", fileRouter);
indexRouter.use("/", folderRouter);

module.exports = indexRouter;
