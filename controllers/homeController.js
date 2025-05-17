const prisma = require("../config/prisma");

exports.getHome = async (req, res, next) => {
    try {
        if (req.user) {
            const files = await prisma.file.findMany({
                where: {
                    userId: req.user.id,
                },
            });
            const folders = await prisma.folder.findMany({
                where: {
                    userId: req.user.id,
                },
            });
            return res.render("index", { folders, folderName: "", files });
        }
        res.render("index");
    } catch (err) {
        next(err);
    }
};
