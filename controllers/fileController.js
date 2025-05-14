const path = require("node:path");

exports.viewFile = (req, res, next) => {
    try {
        const fileName = req.params.fileUrl;
        const filePath = path.join(__dirname, "../uploads", fileName);
        res.sendFile(filePath);
    } catch (err) {
        next(err);
    }
};


