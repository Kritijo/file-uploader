const path = require("node:path");
const prisma = require("../config/prisma");

exports.viewFile = (req, res, next) => {
    try {
        const filePath = path.join(__dirname, "..", req.path);
        res.sendFile(filePath);
    } catch (err) {
        next(err);
    }
};

exports.deleteFile = async (req, res, next) => {
    try {
        const fileid = parseInt(req.params.id);

        const fileRecord = await prisma.file.findUnique({
            where: { id: fileid },
            select: { url: true },
        });

        await prisma.file.delete({
            where: { id: fileid },
        });

        const fs = require("fs/promises");
        await fs.unlink(fileRecord.url);

        res.redirect("/");
    } catch (err) {
        next(err);
    }
};
