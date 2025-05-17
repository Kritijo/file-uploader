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

exports.viewFolder = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const folderId = parseInt(req.params.folderId);

        const folder = await prisma.folder.findUnique({
            where: {
                id: folderId,
            },
            select: {
                name: true,
            },
        });

        const files = await prisma.file.findMany({
            where: {
                userId: req.user.id,
                id: folderId,
            },
        });

        res.render("index", {
            folders: [],
            folderName: folder.name,
            files,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteFolder = (req, res, next) => {};
