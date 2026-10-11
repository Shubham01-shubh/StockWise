
const express = require("express");
const router = express.Router();

const {
  getMovements,
  createMovement,
} = require("../controllers/stockMovementController");

router.get("/", getMovements);
router.post("/", createMovement);

module.exports = router;
