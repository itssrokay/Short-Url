const express = require("express");
const { handGenerateNewShortURL, getAll } = require("../controller/url");

const router = express.Router();

router.post('/', handGenerateNewShortURL);
router.get('/', getAll);

module.exports = router;
