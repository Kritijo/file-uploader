const bcrypt = require("bcryptjs");
const passport = require("passport");
const { validationResult } = require("express-validator");
const prisma = require("../config/prisma");
const { upload } = require("../config/multer");
const path = require("node:path");

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

exports.postUpload = [
    upload.single("file"),

    async (req, res, next) => {
        try {
            const { filename } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).send("No file uploaded.");
            }
            const fileSize = file.size;
            const fileUrl = `uploads/${file.filename}`;

            await prisma.file.create({
                data: {
                    name: filename,
                    size: fileSize,
                    url: fileUrl,
                    userId: req.user.id,
                },
            });
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
];

exports.viewFile = (req, res, next) => {
    try {
        const fileName = req.params.fileUrl;
        const filePath = path.join(__dirname, "../uploads", fileName);
        res.sendFile(filePath);
    } catch (err) {
        next(err);
    }
};
