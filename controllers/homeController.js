const prisma = require("../config/prisma");

exports.getHome = async (req, res, next) => {
    try {
        if (req.user) {
            const files = await prisma.file.findMany({
                where: {
                    userId: req.user.id,
                    folderId: null,
                },
            });
            const folders = await prisma.folder.findMany({
                where: {
                    userId: req.user.id,
                    parentId: null,
                },
            });
            return res.render("index", {
                folders,
                folderId: "",
                folderName: "",
                files,
            });
        }
        res.render("index");
    } catch (err) {
        next(err);
    }
};
