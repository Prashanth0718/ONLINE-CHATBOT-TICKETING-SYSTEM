const Museum = require("../models/Museum");

// ✅ Get all museums
exports.getMuseums = async (req, res) => {
  try {
    const museums = await Museum.find();
    res.json(museums);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch museums" });
  }
};

// ✅ Add a new museum
exports.addMuseum = async (req, res) => {
  try {
    const { name, location, ticketPrice, availableTickets } = req.body;
    const newMuseum = new Museum({ name, location, ticketPrice, availableTickets });
    await newMuseum.save();
    res.status(201).json(newMuseum);
  } catch (error) {
    res.status(500).json({ error: "Failed to add museum" });
  }
};

// ✅ Update museum details
exports.updateMuseum = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMuseum = await Museum.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedMuseum);
  } catch (error) {
    res.status(500).json({ error: "Failed to update museum" });
  }
};

// ✅ Delete a museum
exports.deleteMuseum = async (req, res) => {
  try {
    const { id } = req.params;
    await Museum.findByIdAndDelete(id);
    res.json({ message: "Museum deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete museum" });
  }
};
