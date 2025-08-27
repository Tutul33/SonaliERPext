import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private isConnected = false;

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5020/hubs/notification')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.isConnected = true;
      })
      .catch((err) => 
       {
         debugger
        console.error('SignalR Connection Error: ', err)
       }
      );
  }

  sendMessage(user: string, message: string): void {
    if (!this.isConnected) {
      console.warn('Cannot send message, SignalR not connected yet');
      return;
    }
    this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }

  addMessageListener(callback: (user: string, message: string) => void): void {
    this.hubConnection.on('ReceiveMessage', callback);
  }
}
