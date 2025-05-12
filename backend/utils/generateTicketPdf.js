const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const logoPath = path.join(__dirname, '../assets/Logo.png');
const generateTicketPdf = async (ticketData) => {
  try {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../tickets/ticket-${ticketData.paymentId}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    const backendURL = process.env.BACKEND_URL;
    doc.pipe(writeStream);
    const pageWidth = doc.page.width;
    const logoWidth = 100;
    const logoX = (pageWidth - logoWidth) / 2;

    doc.image(logoPath, logoX, 50, { width: logoWidth }); // Y=50px from top
    doc.moveDown(4); // Add vertical spacing after logo
    // Move down to create space after the logo
    doc.moveDown(); 
    doc.moveDown(); 
    doc.moveDown(); 
    doc.moveDown();

    doc.fontSize(20).text('Museum Entry Ticket', { align: 'center' });
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(14).text(`Museum: ${ticketData.museumName}`);
    doc.text(`Ticket ID: ${ticketData._id}`);
    doc.text(`Date: ${ticketData.date}`);
    doc.text(`Visitors: ${ticketData.visitors}`);
    doc.text(`Price Paid: ₹${ticketData.price}`);
    doc.text(`Status: ${ticketData.status}`);
    doc.text(`Payment ID: ${ticketData.paymentId}`);
    doc.text(`Booked By (User ID): ${ticketData.userId}`);
    doc.moveDown();
    doc.moveDown();


    // ✅ Generate QR Code with secure verification URL
    const verificationUrl = `${backendURL}/api/tickets/verify/${ticketData._id}`; // Update this line
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);

    // Convert base64 Data URL to buffer
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');


    // 🖋️ Add a label above the QR code
doc.moveDown();
doc.fontSize(16).text('Your Unique Ticket Code', {
  align: 'left',
  underline: true,
});
doc.moveDown(0.5); // Slight spacing

// 🖼️ Calculate dimensions
const qrWidth = 100;
const padding = 10;
const borderSize = qrWidth + padding * 2;
const qrX = 75;
const qrY = doc.y;

// 🟥 Draw border around QR
doc
  .rect(qrX, qrY, borderSize, borderSize)
  .stroke('#333');

// 📌 Place QR code inside the padded box
doc.image(imgBuffer, qrX + padding, qrY + padding, { width: qrWidth });
doc.moveDown(1);
// 👇 Move cursor below QR code
doc.moveDown(5); 
doc.moveDown(2);
doc.fontSize(12).fillColor('gray').text('Scan QR to verify ticket at the gate.', {
  align: 'left',
});

// const qrWidth = 100;
// const qrX = (doc.page.width - qrWidth) / 2;

// doc.fontSize(20).text('Scan QR Code to Check Ticket is Verified', { align: 'center' });
// doc.image(imgBuffer, qrX, doc.y, { width: qrWidth }); // doc.y maintains vertical flow
// doc.moveDown();
// doc.moveDown();

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    });
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    throw err;
  }
};

module.exports = generateTicketPdf;
