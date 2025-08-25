import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PdfViewerService {
  // PDF source (URL or Blob URL)
  pdfSrc$ = new BehaviorSubject<string | null>(null);
  // Controls dialog visibility
  visible$ = new BehaviorSubject<boolean>(false);

  open(src: string) {
    this.pdfSrc$.next(src);
    this.visible$.next(true);
  }

  close() {
    this.visible$.next(false);
    this.pdfSrc$.next(null);
  }
}

