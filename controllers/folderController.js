const prisma = require("../config/prisma");

exports.getFolderUpload = (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("upload-folder");
};

exports.postFolderUpload = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const folderName = req.body.foldername;

        const existingFolder = await prisma.folder.findFirst({
            where: {
                name: folderName,
                userId: userId,
            },
        });

        if (existingFolder) {
            const error = new Error("Folder name already exists.");
            error.status = 400;
            return next(error);
        }

        await prisma.folder.create({
            data: {
                name: folderName,
                userId: userId,
            },
        });
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

exports.deleteFolder = (req, res, next) => {};
