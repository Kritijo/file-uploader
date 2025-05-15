exports.getFolderUpload = (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("upload-folder");
};

exports.postFolderUpload = (req, res, next) => {};

exports.deleteFolder = (req, res, next) => {};
