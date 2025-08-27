import { Component } from '@angular/core';
import { SignalRService } from '../../services/signalr-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth.selectors';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  loggedUser$: Observable<any | null>;
  loggedBy: any;
  chatVisible = false;
  message = '';
  messages: string[] = [];

  constructor(private store: Store, private signalRService: SignalRService) {
    this.loggedUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addMessageListener((user, msg) => {
      this.messages.push(`${user}: ${msg}`);
    });
    this.setLoggedUserInfo();
  }
  
  setLoggedUserInfo() {
    try {
      this.loggedUser$.subscribe(user => {
        if (user) {
          this.loggedBy = user.userName;
        }
      });
    } catch (error) {
      //this.msgSvc.showErrorMsg(error);
    }
  }
  toggleChat(): void {
    this.chatVisible = !this.chatVisible;
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.signalRService.sendMessage(this.loggedBy, this.message);
      this.message = '';
    }
  }
}
