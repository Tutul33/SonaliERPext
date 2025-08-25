import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfViewerService {
  _visible = false;
  private _pdfSrc = '';

  open(src: string) {
    this._pdfSrc = src;
    this._visible = true;
  }

  close() {
    this._visible = false;
  }

  pdfSrc() {
    return this._pdfSrc;
  }
}
