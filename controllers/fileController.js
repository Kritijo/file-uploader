const prisma = require("../config/prisma");
const supabase = require("../config/supabase");
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
            const file = req.file;
            const folderIdParam = req.params.folderId;
            const folderId = folderIdParam ? parseInt(folderIdParam) : null;

            if (!file) {
                return res.status(400).send("No file uploaded.");
            }

            const supabasePath = `user_${req.user.id}/${Date.now()}_${
                file.originalname
            }`;

            const { data, error } = await supabase.storage
                .from("uploads")
                .upload(supabasePath, file.buffer, {
                    contentType: file.mimetype,
                });

            if (error) return next(error);

            await prisma.file.create({
                data: {
                    name: file.originalname,
                    size: file.size,
                    url: supabasePath,
                    userId: req.user.id,
                    folderId: folderId,
                },
            });
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
];

exports.viewFile = async (req, res, next) => {
    const file = await prisma.file.findUnique({
        where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    const { data, error } = await supabase.storage
        .from("uploads")
        .createSignedUrl(file.url, 60 * 5);

    if (error) return next(error);

    res.redirect(data.signedUrl);
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

        await supabase.storage.from("uploads").remove([fileRecord.url]);

        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

exports.downloadFile = async (req, res, next) => {
    const axios = require("axios");

    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(req.params.id), userId: req.user.id },
        });
        if (!file) {
            const error = new Error("File not found.");
            error.status = 404;
            return next(error);
        }

        const { data, error } = await supabase.storage
            .from("uploads")
            .createSignedUrl(file.url, 60);

        if (error) return next(error);
        
        const fileStream = await axios({
            method: "GET",
            url: data.signedUrl,
            responseType: "stream",
        });

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.name}"`
        );

        fileStream.data.pipe(res);
    } catch (err) {
        next(err);
    }
};
