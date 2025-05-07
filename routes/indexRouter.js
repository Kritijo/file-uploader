const { Router } = require("express");
const indexRouter = Router();

const homeController = require("../controllers/homeController");

indexRouter.get("/", homeController.getHome);

module.exports = indexRouter;
