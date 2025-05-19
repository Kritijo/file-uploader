const prisma = require("../config/prisma");

exports.getFolderUpload = (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    const folderId = req.params.folderId;
    res.render("upload-folder", { folderId, folderName: "", edit: false });
};

exports.postFolderUpload = async (req, res, next) => {
    try {
        const folderIdParam = req.params.folderId;
        const folderId = folderIdParam ? parseInt(folderIdParam) : null;
        const userId = req.user.id;

        const folderName = req.body.foldername;

        const existingFolder = await prisma.folder.findFirst({
            where: {
                name: folderName,
                userId: userId,
                parentId: folderId,
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
                parentId: folderId,
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
                id: true,
                name: true,
            },
        });

        const files = await prisma.file.findMany({
            where: {
                userId: req.user.id,
                folderId: folderId,
            },
        });

        const folders = await prisma.folder.findMany({
            where: {
                userId: req.user.id,
                parentId: folderId,
            },
        });

        res.render("index", {
            folders,
            folderId: folder.id,
            folderName: folder.name,
            files,
        });
    } catch (err) {
        next(err);
    }
};

exports.getEditFolder = async (req, res, next) => {
    try {
        const folderId = parseInt(req.params.folderId);
        const folder = await prisma.folder.findUnique({
            where: {
                id: folderId,
            },
            select: {
                name: true,
            },
        });
        res.render("upload-folder", {
            folderId,
            folderName: folder.name,
            edit: true,
        });
    } catch (err) {
        next(err);
    }
};

exports.postEditFolder = async (req, res, next) => {
    try {
        const folderId = parseInt(req.params.folderId);
        const folderName = req.body.foldername;

        await prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                name: folderName,
            },
        });
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

const getAllDescendantFolderIds = async (folderId) => {
    const results = await prisma.$queryRaw`
        WITH RECURSIVE subfolders AS (
            SELECT id FROM "Folder" WHERE id = ${folderId}
            UNION ALL
            SELECT f.id FROM "Folder" f
            INNER JOIN subfolders sf ON f."parentId" = sf.id
        )
        SELECT id FROM subfolders;
    `;

    return results.map((row) => row.id);
};

const deleteFilesInFolders = async (folderIds, userId) => {
    const supabase = require("../config/supabase");

    const files = await prisma.file.findMany({
        where: {
            folderId: { in: folderIds },
            userId: userId,
        },
        select: { url: true },
    });

    const pathsToDelete = files.map((file) => file.url).filter(Boolean);

    if (pathsToDelete.length > 0) {
        const { error } = await supabase.storage
            .from("uploads")
            .remove(pathsToDelete);

        if (error) {
            console.warn("Supabase deletion error:", error.message);
        }
    }
};

exports.deleteFolder = async (req, res, next) => {
    try {
        const folderId = parseInt(req.params.folderId);
        const userId = req.user.id;

        const folderIds = await getAllDescendantFolderIds(folderId);

        await deleteFilesInFolders(folderIds, userId);

        await prisma.folder.deleteMany({
            where: {
                id: { in: folderIds },
                userId: userId,
            },
        });
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};
