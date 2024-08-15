const shortid = require("shortid");
const URL = require("../model/url");

async function handGenerateNewShortURL(req, res) {
    const shortID = shortid();
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: "url is required" });
    }

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.json({ id: shortID });
}

async function getAll(req, res) {
    const allUrl = await URL.find({});
    if (allUrl.length === 0) {
        return res.status(404).end("No URLs found.");
    }
    return res.json(allUrl);
}

module.exports = {
    handGenerateNewShortURL,
    getAll,
};
