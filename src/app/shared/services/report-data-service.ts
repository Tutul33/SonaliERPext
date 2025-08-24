import { Injectable } from '@angular/core';
import { GlobalMethods } from '../models/javascriptMethods';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {

  reportUrl: string = GlobalMethods.ApiUrl() + 'Reports/';
  constructor(private http: HttpClient) {

  }

  getReport(entity: any): Observable<any> {
    return this.http.post(this.reportUrl + 'ShowReports', entity);
  }
  printReport(reportData: any) {
    try {
      this.getReport(reportData).subscribe({
        next: async (res: any) => {
          let pdfName = res.data.fileName;
          let extension;

          switch (reportData.reportType) {
            case GlobalMethods.reportRenderingType.PDF:
              extension = "pdf";
              break;
            case GlobalMethods.reportRenderingType.Excel:
              extension = "xlsx";
              break;
            case GlobalMethods.reportRenderingType.word:
              extension = "docx";
              break;
            case GlobalMethods.reportRenderingType.Image:
              extension = "png";
              break;
            default:
              extension = "";
          }
          if (extension) {
            const url = GlobalMethods.ApiHost() + "reports/" + extension + "/" + pdfName;
            window.open(url, '_blank');
          }
        },
        error: (res: any) => { },
      });
    } catch (e) {
      throw e;
    }
  }
}
