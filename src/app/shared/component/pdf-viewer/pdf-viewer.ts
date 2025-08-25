import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PdfViewerService } from '../../services/pdf.viewer.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, DialogModule,PdfViewerModule],
  templateUrl: './pdf-viewer.html',
})
export class PdfViewer {

   service = inject(PdfViewerService);

  
}
