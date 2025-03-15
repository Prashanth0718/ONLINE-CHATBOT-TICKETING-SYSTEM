const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Museum = require("./models/Museum");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ MongoDB Connected. Adding museums...");

    const museums = [
      { name: "Louvre Museum", location: "Paris, France", timings: "9 AM - 6 PM (Closed on Tuesdays)", ticketPrice: 25, details: "World-famous museum with the Mona Lisa." },
      { name: "British Museum", location: "London, UK", timings: "10 AM - 5:30 PM (Open daily)", ticketPrice: 0, details: "Home to the Rosetta Stone and Egyptian mummies." },
      { name: "Metropolitan Museum of Art", location: "New York, USA", timings: "10 AM - 5 PM (Closed on Wednesdays)", ticketPrice: 30, details: "Largest museum in the US." }
    ];

    await Museum.insertMany(museums);
    console.log("✅ Museum data inserted!");
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));
