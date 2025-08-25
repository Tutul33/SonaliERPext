import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfViewerService {
  // PDF source (URL or Blob URL)
  pdfSrc = signal<string | null>(null);

  // Controls dialog visibility
  visible = signal<boolean>(false);

  open(src: string) {
    this.pdfSrc.set(src);
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
    this.pdfSrc.set(null);
  }
}
