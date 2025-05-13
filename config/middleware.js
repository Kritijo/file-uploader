const path = require("node:path");
const express = require("express");

function setupMiddleware(app) {
    const assetsPath = path.join(__dirname, "../public");
    app.use(express.static(assetsPath));

    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "ejs");

    app.use("/uploads", express.static("uploads"));

    app.use(express.urlencoded({ extended: true }));
}

module.exports = setupMiddleware;
