const express = require("express");
const router = express.Router();
const cors = require("cors");

const handler = require("../controllers/handler");
const mapController = require("../controllers/mapController");



router.get("/map", cors(), handler(mapController.getMap));
router.get("/excess", cors(), handler(mapController.getExcess));
router.get("/*", (req, res, next) => { res.status(404).json({ error: "La route n'existe pas" })});

module.exports = router;
