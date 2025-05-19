const fs = require("fs/promises");
const path = require("node:path");
const prisma = require("../config/prisma");
const { upload } = require("../config/multer");

exports.getFileUpload = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    const folderId = req.params.folderId;

    res.render("upload-file", { folderId });
};

exports.postFileUpload = [
    upload.single("file"),

    async (req, res, next) => {
        try {
            const filename = req.file.originalname;
            const file = req.file;
            const folderIdParam = req.params.folderId;
            const folderId = folderIdParam ? parseInt(folderIdParam) : null;

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
                    folderId,
                },
            });
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
];

exports.viewFile = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, "..", req.path);
        await fs.access(filePath);
        res.sendFile(filePath);
    } catch {
        const error = new Error("File not found.");
        error.status = 404;
        return next(error);
    }
};

exports.deleteFile = async (req, res, next) => {
    try {
        const fileid = parseInt(req.params.id);

        const fileRecord = await prisma.file.findUnique({
            where: {
                userId: req.user.id,
                id: fileid,
            },
            select: { url: true },
        });

        await prisma.file.delete({
            where: {
                userId: req.user.id,
                id: fileid,
            },
        });

        await fs.unlink(fileRecord.url);

        res.redirect("/");
    } catch (err) {
        next(err);
    }
};
