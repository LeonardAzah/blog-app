const express = require("express");
const router = express.Router();
const signinController = require("../controller/signinController");

router.post("/", signinController.userLogin);

module.exports = router;
