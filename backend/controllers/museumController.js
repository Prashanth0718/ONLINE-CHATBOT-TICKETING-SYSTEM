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

// ➡️ Create a new daily stat entry
exports.createMuseumStat = async (req, res) => {
  try {
    const { museumId } = req.params;
    const { date, availableTickets, bookedTickets } = req.body;

    const museum = await Museum.findById(museumId);
    if (!museum) {
      return res.status(404).json({ error: "Museum not found" });
    }

    museum.dailyStats.push({ date, availableTickets, bookedTickets });
    await museum.save();

    res.status(201).json({ message: "Daily stat created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create daily stat" });
  }
};

// ➡️ Update an existing daily stat entry
exports.updateMuseumStat = async (req, res) => {
  try {
    const { museumId, statId } = req.params;
    const { date, availableTickets, bookedTickets } = req.body;

    const museum = await Museum.findById(museumId);
    if (!museum) {
      return res.status(404).json({ error: "Museum not found" });
    }

    const stat = museum.dailyStats.id(statId);
    if (!stat) {
      return res.status(404).json({ error: "Stat not found" });
    }

    stat.date = date;
    stat.availableTickets = availableTickets;
    stat.bookedTickets = bookedTickets;

    await museum.save();

    res.json({ message: "Daily stat updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update daily stat" });
  }
};

// ➡️ Delete a specific daily stat entry
exports.deleteMuseumStat = async (req, res) => {
  try {
    const { museumId, statId } = req.params;

    const museum = await Museum.findById(museumId);
    if (!museum) {
      return res.status(404).json({ error: "Museum not found" });
    }

    // Filter out the stat to be deleted
    museum.dailyStats = museum.dailyStats.filter(stat => stat._id.toString() !== statId);

    await museum.save();

    res.json({ message: "Daily stat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete daily stat" });
  }
};



