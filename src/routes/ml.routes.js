const express = require("express");
const { predictPCOS } = require("../controllers/ml.controller");

const router = express.Router();
router.post("/pcos-predict", predictPCOS);

module.exports = router;