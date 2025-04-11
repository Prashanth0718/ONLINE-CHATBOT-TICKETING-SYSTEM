const express = require("express");
const { getMuseums, addMuseum, updateMuseum, deleteMuseum } = require("../controllers/museumController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMuseums); // Remove authMiddleware
router.post("/", addMuseum);
router.put("/:id", updateMuseum);
router.delete("/:id", deleteMuseum);


module.exports = router;
