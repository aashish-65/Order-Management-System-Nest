import { Injectable } from '@nestjs/common';
import { InvoiceResponseDto } from '../../dto/invoice-response.dto';
import PDFDocument from 'pdfkit';
@Injectable()
export class InvoicePdfService {
  private drawHeader(doc: PDFKit.PDFDocument) {
    doc.rect(0, 0, doc.page.width, 90).fill('#2563EB');

    doc
      .fillColor('white')
      .font('NotoSans-Bold')
      .fontSize(28)
      .text('ORDER INVOICE', 50, 30);

    doc.moveDown(3);

    doc.fillColor('black');
  }

  private drawInvoiceInfo(
    doc: PDFKit.PDFDocument,
    invoice: InvoiceResponseDto,
  ) {
    doc.font('NotoSans-Bold').fontSize(13).text('Invoice Details', 50, 120);

    doc.moveTo(50, 140).lineTo(550, 140).stroke();

    doc.font('NotoSans');

    doc.text(`Invoice Number : ${invoice.invoiceNumber}`, 50, 155);

    doc.text(
      `Invoice Date : ${invoice.createdAt.toLocaleDateString()}`,
      320,
      155,
    );
  }

  private drawCustomer(doc: PDFKit.PDFDocument, invoice: InvoiceResponseDto) {
    let y = 200;

    doc.font('NotoSans-Bold').fontSize(13).text('Customer', 50, y);

    y += 20;

    doc.font('NotoSans');

    doc.text(
      `${invoice.customer.firstName} ${invoice.customer.lastName}`,
      50,
      y,
    );

    y += 18;

    doc.text(invoice.customer.email, 50, y);
  }

  private drawItemsTable(doc: PDFKit.PDFDocument, invoice: InvoiceResponseDto) {
    let y = 290;

    doc.font('NotoSans-Bold').fontSize(12);

    doc.text('Product', 50, y);

    doc.text('Qty', 300, y);

    doc.text('Price', 360, y);

    doc.text('Total', 470, y);

    y += 15;

    doc.moveTo(50, y).lineTo(550, y).stroke();

    y += 10;

    doc.font('NotoSans');

    invoice.items.forEach((item) => {
      doc.text(item.productName, 50, y);

      doc.text(item.quantity.toString(), 300, y);

      doc.text(`₹${item.unitPrice}`, 360, y);

      doc.text(`₹${item.totalPrice}`, 470, y);

      y += 25;
    });
  }

  private drawTotals(doc: PDFKit.PDFDocument, invoice: InvoiceResponseDto) {
    let y = doc.y + 20;

    doc.moveTo(300, y).lineTo(550, y).stroke();

    y += 20;

    doc.font('NotoSans');

    doc.text('Subtotal', 330, y);

    doc.text(`₹${invoice.subTotal}`, 470, y);

    y += 20;

    doc.text('Tax', 330, y);

    doc.text(`₹${invoice.tax}`, 470, y);

    y += 20;

    doc.text('Shipping', 330, y);

    doc.text(`₹${invoice.shippingCharge}`, 470, y);

    y += 25;

    doc.font('NotoSans-Bold').fontSize(14);

    doc.text('Grand Total', 330, y);

    doc.text(`₹${invoice.grandTotal}`, 470, y);
  }

  private drawPaymentInfo(
    doc: PDFKit.PDFDocument,
    invoice: InvoiceResponseDto,
  ) {
    let y = doc.y + 40;

    doc.font('NotoSans-Bold').fontSize(13).text('Payment Information', 50, y);

    y += 20;

    doc.font('NotoSans');

    doc.text(`Method : ${invoice.payment.paymentMethod}`, 50, y);

    y += 18;

    doc.text(`Provider : ${invoice.payment.provider}`, 50, y);

    y += 18;

    doc.text(`Status : ${invoice.payment.status}`, 50, y);
  }

  private drawFooter(doc: PDFKit.PDFDocument) {
    const y = 760;

    doc.moveTo(50, y).lineTo(550, y).stroke();

    doc
      .fontSize(11)
      .font('NotoSans')
      .fillColor('gray')
      .text('Thank you for shopping with us!', 220, y + 15);
  }

  async generateInvoicePdf(invoice: InvoiceResponseDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      doc.registerFont('NotoSans', `src/assets/fonts/NotoSans-Regular.ttf`);

      doc.registerFont('NotoSans-Bold', `src/assets/fonts/NotoSans-Bold.ttf`);

      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on('error', (error) => {
        reject(error);
      });

      this.drawHeader(doc);
      this.drawInvoiceInfo(doc, invoice);
      this.drawCustomer(doc, invoice);
      this.drawItemsTable(doc, invoice);
      this.drawTotals(doc, invoice);
      this.drawPaymentInfo(doc, invoice);
      this.drawFooter(doc);

      doc.end();
    });
  }
}
