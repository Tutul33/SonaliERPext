import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { SignalRService } from '../../services/signalr-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth.selectors';
import { TabsModule } from 'primeng/tabs';
interface ChatTab {
  user: string;
  messages: { sender: string; text: string, isRead: boolean }[];
  newMessage: string;
  totalUnread: number;
}
@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, Button, TabsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements AfterViewChecked {
  loggedUser$: Observable<any | null>;
  loggedBy: string = '';
  chatVisible = false;
  activeUsers: any[] = [];
  chatTabs: ChatTab[] = [];
  activeTabIndex = 0;
  tempUserList: any;
  searchUserObj: string = '';
  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;
  constructor(private store: Store, private signalR: SignalRService) {
    this.loggedUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {
    this.getFinanceAndAccountUsers();

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      const el = this.chatMessagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) { }
  }

  getFinanceAndAccountUsers() {
    this.signalR.GetFinanceAndAccountUsers().subscribe({
      next: (response: any) => {
        const list = response?.data?.list ?? [];

        this.activeUsers = list.filter(x => x.userName != this.loggedBy).map((u: any) => ({ userName: u.userName, isOnline: false }));
        this.tempUserList = list.filter(x => x.userName != this.loggedBy).map((u: any) => ({ userName: u.userName, isOnline: false }));
        this.setLoggedUserInfo();
      },
      error: err => console.error(err)
    });
  }

  searchUser() {
    try {
      if (this.searchUserObj) {
        this.activeUsers = this.tempUserList.filter(x => x.userName.includes(this.searchUserObj));
      } else {
        this.activeUsers = this.tempUserList;
      }
    } catch (error) {

    }
  }

  setLoggedUserInfo() {
    this.loggedUser$.subscribe(user => {
      if (user) {
        this.loggedBy = user.userName;
        this.signalR.startConnection(this.loggedBy);

        // Listen for private messages
        // this.signalR.onMessage((sender, msg) => {
        //   let tab = this.chatTabs.find(t => t.user === sender);
        //   if (!tab) {
        //     tab = { user: sender, messages: [], newMessage: '',totalUnread:1 };
        //     this.chatTabs.push(tab);
        //   }
        //   tab.messages.push({ sender, text: msg, isRead:false });
        // });
        this.signalR.onMessage((sender, msg) => {
          let tab = this.chatTabs.find(t => t.user === sender);
          if (!tab) {
            tab = { user: sender, messages: [], newMessage: '', totalUnread: 0 };
            this.chatTabs.push(tab);
          }
          tab.messages.push({ sender, text: msg, isRead: false });

          // increment unread only if the tab is NOT active
          const isActive = this.chatTabs.indexOf(tab) === this.activeTabIndex;
          if (!isActive) {
            tab.totalUnread++;
          }
        });

        // Listen for active users
        this.signalR.onActiveUsers(users => {
          const activeUsers = users.filter(u => u !== this.loggedBy);
          this.activeUsers.forEach((item) => {
            const user = activeUsers.find(u => u == item.userName);
            if (user) {
              item.isOnline = true;
            } else {
              item.isOnline = false;
            }
          });
        });
      }
    });
  }

  toggleChat() {
    try {
      this.chatVisible = !this.chatVisible;
      if (this.chatVisible) {
        this.getFinanceAndAccountUsers();
        this.setLoggedUserInfo();
      }
    } catch (error) {

    }
  }

  // openChat(user: string) {
  //   let tab = this.chatTabs.find(t => t.user === user);
  //   if (!tab) {
  //     tab = { user, messages: [], newMessage: '',totalUnread:1 };
  //     this.chatTabs.push(tab);

  //     // Delay to ensure tab renders before setting active index
  //     setTimeout(() => {
  //       this.activeTabIndex = this.chatTabs.length - 1;
  //     });
  //   } else {
  //     this.activeTabIndex = this.chatTabs.indexOf(tab);
  //   }
  // }
  openChat(user: string) {
    let tab = this.chatTabs.find(t => t.user === user);
    if (!tab) {
      tab = { user, messages: [], newMessage: '', totalUnread: 0 };
      this.chatTabs.push(tab);

      // Delay to ensure tab renders before setting active index
      setTimeout(() => {
        this.activeTabIndex = this.chatTabs.length - 1;
      });
    } else {
      this.activeTabIndex = this.chatTabs.indexOf(tab);
    }

    // reset unread count when chat is opened
    tab.totalUnread = 0;
    tab.messages.forEach(m => m.isRead = true);
  }


  send(tab: ChatTab) {
    if (!tab.newMessage.trim()) return;
    this.signalR.sendPrivateMessage(this.loggedBy, tab.user, tab.newMessage);
    tab.messages.push({ sender: this.loggedBy, text: tab.newMessage, isRead: true });
    tab.newMessage = '';
  }

  closeTab(tab) {
    try {
      this.chatTabs = this.chatTabs.filter(x => x.user != tab.user);
    } catch (error) {

    }
  }

  onTabChange(index: any) {
  this.activeTabIndex = index;
  const tab = this.chatTabs[index];
  if (tab) {
    tab.totalUnread = 0;
    tab.messages.forEach(m => m.isRead = true);
  }
}
}
