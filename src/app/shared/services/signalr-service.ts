import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { GlobalMethods } from '../models/javascriptMethods';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private isConnected = false;
  private url:any=GlobalMethods.ApiHost();
  constructor(private http:HttpClient){

  }

  startConnection(username: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url+`chathub?username=${username}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => this.isConnected = true)
      .catch(err => console.error('SignalR Connection Error:', err));
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .catch(err => console.error('Error stopping SignalR connection:', err));
    }
  }

  sendPrivateMessage(sender: string, receiver: string, message: string) {
    if (!this.isConnected) return;
    this.hubConnection.invoke('SendPrivateMessage', sender, receiver, message);
  }

  onMessage(callback: (fromUser: string, message: string) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  onActiveUsers(callback: (users: string[]) => void) {
    this.hubConnection.on('ActiveUsers', callback);
  }

   GetFinanceAndAccountUsers(): Observable<any> {   
    const url=this.url+`api/voucher/GetFinanceAndAccountUsers`;
    debugger;
        return this.http.get<any>(
           url
        );
     }
}
