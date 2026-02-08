const express = require("express");
const router = express.Router();
const { getMenu } = require("../controllers/menu.controller");

router.get("/", getMenu);

module.exports = router;
