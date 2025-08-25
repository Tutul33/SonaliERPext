import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerService } from '../../services/pdf.viewer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, DialogModule, NgxExtendedPdfViewerModule],
  templateUrl: './pdf-viewer.html',
})
export class PdfViewer implements OnInit, OnDestroy {
  service = inject(PdfViewerService);

  visible: boolean = false;
  pdfSrc: string | null = null;

  private sub1!: Subscription;
  private sub2!: Subscription;

  ngOnInit() {
    // subscribe to observables and update local properties
   
    this.sub2 = this.service.pdfSrc$.subscribe(src => 
      this.pdfSrc = src
    );
    this.sub1 = this.service.visible$.subscribe(v => 
      setTimeout(()=>{
        this.visible = v
      },500)
    );
  }

  onDialogHide() {
    this.service.close(); // closes the dialog and clears pdfSrc
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
