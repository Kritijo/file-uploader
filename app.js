require("dotenv").config();

const express = require("express");
const app = express();

const setupMiddleware = require("./config/middleware");
setupMiddleware(app);

const session = require("./config/session.js");
app.use(session);

const passport = require("passport");
const initializePassport = require("./config/passport");

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

const flash = require("express-flash");
app.use(flash());

const indexRouter = require("./routes/indexRouter");

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use("/", indexRouter);

const { notFound, errorHandler } = require("./config/errorHandlers");
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Express server running at http://localhost:${PORT}`)
);
