import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalMethods } from '../../shared/models/javascriptMethods';

@Injectable({
  providedIn: 'root'
})
export class UserRoleMapDataService {
   url: string = GlobalMethods.ApiUrl()+'User/';
   constructor(private http: HttpClient) {

   }
   
   getVoucherApprovalList(): Observable<any> {      
      return this.http.get<any>(
         this.url + `GetUsersRoleMap`
      );
   }

   UpdateUserRoleMap(data:any): Observable<any> {
        return this.http.post<any>(
            this.url+`UpdateUserRoleMap`,
            data
        );
    }
}
