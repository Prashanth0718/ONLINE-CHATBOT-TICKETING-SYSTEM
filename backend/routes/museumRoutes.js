const express = require("express");
const { getMuseums, addMuseum, updateMuseum, deleteMuseum, createMuseumStat, updateMuseumStat, deleteMuseumStat } = require("../controllers/museumController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMuseums); // Remove authMiddleware
router.post("/", addMuseum);
router.put("/:id", updateMuseum);
router.delete("/:id", deleteMuseum);
router.post('/:museumId/stats', createMuseumStat);
router.put('/:museumId/stats/:statId', updateMuseumStat);
router.delete('/:museumId/stats/:statId', deleteMuseumStat);


module.exports = router;
