import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginDataService {
   url:string='http://localhost:5020/api/login/';
   constructor(private http: HttpClient) {

    }
  login(email: string, password: string): Observable<any> {
        return this.http.post<any>(
            this.url+`login`,
            { userName:email, password}
        );
    }
}
