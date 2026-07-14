import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoicePdfService } from './pdf/invoice-pdf/invoice-pdf.service';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoicePdfService],
  imports: [TypeOrmModule.forFeature([Invoice])],
  exports: [InvoiceService],
})
export class InvoiceModule {}
