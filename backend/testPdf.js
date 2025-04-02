const { generatePDFTicket } = require("./utils/pdfGenerator");

generatePDFTicket("John Doe", "National Museum", "2025-03-20", 500, 2)
  .then((filePath) => {
    console.log("✅ PDF generated at:", filePath);
  })
  .catch((error) => {
    console.error("❌ PDF generation failed:", error);
  });
