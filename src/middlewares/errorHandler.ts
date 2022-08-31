export async function errorHandler(error, req, res, next) {
    if (error.code === "NotFound") {
        return res.status(404).send(error.message);
    }
    res.sendStatus(500);
}
