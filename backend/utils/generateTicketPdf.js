const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const generateTicketPdf = async (ticketData) => {
  try {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../tickets/ticket-${ticketData.paymentId}.pdf`);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    doc.fontSize(20).text('Museum Entry Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Museum: ${ticketData.museumName}`);
    doc.text(`Date: ${ticketData.date}`);
    doc.text(`Visitors: ${ticketData.visitors}`);
    doc.text(`Price Paid: ₹${ticketData.price}`);
    doc.text(`Status: ${ticketData.status}`);
    doc.text(`Payment ID: ${ticketData.paymentId}`);
    doc.text(`Booked By (User ID): ${ticketData.userId}`);
    doc.moveDown();

    // ✅ Generate QR Code with relevant ticket info
    const qrText = JSON.stringify({
      museum: ticketData.museumName,
      date: ticketData.date,
      paymentId: ticketData.paymentId,
      visitors: ticketData.visitors,
    });

    const qrDataUrl = await QRCode.toDataURL(qrText);

    // Convert base64 Data URL to buffer
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    // ✅ Add QR code to PDF
    doc.image(imgBuffer, { width: 100, align: 'center' });

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
