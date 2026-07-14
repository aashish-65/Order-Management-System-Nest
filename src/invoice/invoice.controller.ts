import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoicePdfService } from './pdf/invoice-pdf/invoice-pdf.service';
import type { Response } from 'express';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoicePdfService: InvoicePdfService,
  ) {}

  @Get(':id')
  getInvoiceById(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Get('order/:orderId')
  getInvoiceByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.invoiceService.getInvoiceByOrderId(orderId);
  }

  @Get(':id/pdf')
  async downloadInvoicePdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const invoice = await this.invoiceService.getInvoiceById(id);
    const pdf = await this.invoicePdfService.generateInvoicePdf(invoice);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    });

    res.send(pdf);
  }
}
