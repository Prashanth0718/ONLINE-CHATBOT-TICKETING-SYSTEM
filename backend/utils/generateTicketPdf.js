const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateTicketPdf = (ticketData) => {
  return new Promise((resolve, reject) => {
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

    doc.end();

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
};

module.exports = generateTicketPdf;
