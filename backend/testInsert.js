const mongoose = require("mongoose");
const Ticket = require("./models/Ticket"); // Adjust the path if needed

async function testInsert() {
  try {
    await mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const testTicket = new Ticket({
      userId: "67d274e21f7f18d056bc7555",
      museumName: "Louvre",
      date: new Date("2025-03-15"),
      price: 20,
      paymentId: "test_payment_123",
      status: "booked",
      visitors: 1,
    });

    const savedTicket = await testTicket.save();
    console.log("✅ Ticket saved successfully:", savedTicket);
  } catch (error) {
    console.error("❌ Error saving ticket:", error);
  } finally {
    mongoose.connection.close();
  }
}

testInsert();
