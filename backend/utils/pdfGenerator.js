const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateTicketPDF = async (ticket) => {
  try {
    const folderPath = path.join(__dirname, "../tickets");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true }); // Ensure folder exists
      console.log("📂 Created tickets folder:", folderPath);
    }

    const fileName = `ticket_${ticket._id}.pdf`;
    const filePath = path.join(folderPath, fileName);
    console.log("📄 Generating PDF at:", filePath);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text("🎟️ Museum Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Museum: ${ticket.museumName}`);
    doc.text(`Date: ${ticket.date}`);
    doc.text(`Visitors: ${ticket.visitors}`);
    doc.text(`Price: ₹${ticket.price}`);
    doc.moveDown();
    doc.text("Thank you for booking with us!", { align: "center" });

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        console.log("✅ PDF Successfully Created:", filePath);
        resolve(filePath);
      });

      writeStream.on("error", (error) => {
        console.error("❌ Error Creating PDF:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("❌ PDF Generation Failed:", error);
    throw error;
  }
};

module.exports = generateTicketPDF;
