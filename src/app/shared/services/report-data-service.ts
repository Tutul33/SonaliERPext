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
  printReport(reportData: any,isDownload:boolean) {
    try {
      this.getReport(reportData).subscribe({
        next: async (res: any) => {
          let fileName = res.data.fileName;
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
          if (extension=="pdf" && !isDownload) {
            const url = GlobalMethods.ApiHost() + "reports/" + extension + "/" + fileName;
            window.open(url, '_blank');
          }else{
            this.download(extension,fileName);
          }
        },
        error: (res: any) => { },
      });
    } catch (e) {
      throw e;
    }
  }
  downloadReport(fileType:string,fileName: string) {
    return this.http.get(`${this.reportUrl}download/${fileType}/${fileName}`, {
      responseType: 'blob'
    });
  }

  download(fileType:string,fileName: string) {
    this.downloadReport(fileType,fileName).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
