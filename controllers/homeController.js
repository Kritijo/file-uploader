const prisma = require("../config/prisma");

exports.getHome = async (req, res, next) => {
    try {
        if (req.user) {
            const files = await prisma.file.findMany({
                where: {
                    userId: req.user.id,
                },
            });
            return res.render("index", { files });
        }
        res.render("index");
    } catch (err) {
        next(err);
    }
};
