const bcrypt = require("bcryptjs");
const passport = require("passport");
const { validationResult } = require("express-validator");
const prisma = require("../config/prisma");

exports.getSignUp = (req, res, next) => {
    res.render("signup-form", {
        errors: [],
    });
};

exports.postSignUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("signup-form", {
            errors: errors.array(),
        });
    }

    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.redirect("/login");
    } catch (err) {
        next(err);
    }
};

exports.getLogIn = (req, res, next) => {
    res.render("login-form");
};

exports.postLogIn = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
};

exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

exports.getUpload = (req, res, next) => {
    res.render("upload-form");
};
