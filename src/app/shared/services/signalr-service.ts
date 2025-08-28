import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private isConnected = false;
  
  constructor(private http:HttpClient){

  }

  startConnection(username: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5020/chathub?username=${username}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => this.isConnected = true)
      .catch(err => console.error('SignalR Connection Error:', err));
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
        return this.http.get<any>(
           `http://localhost:5020/api/voucher/GetFinanceAndAccountUsers`
        );
     }
}
