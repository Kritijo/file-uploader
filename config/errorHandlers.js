module.exports = {
    notFound: (req, res) => {
        res.status(404).render("partials/error", {
            message: "Page Not Found",
            status: 404,
        });
    },
    errorHandler: (err, req, res, next) => {
        console.error(err.stack);
        res.status(err.status || 500).render("partials/error", {
            message: err.message || "Something went wrong",
            status: err.status || 500,
        });
    }
};