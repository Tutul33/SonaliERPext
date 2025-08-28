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
  messages: { sender: string; text: string; isRead: boolean; file?: FileMessage }[];
  newMessage: string;
  totalUnread: number;
  pendingFile?: FileMessage;
}

interface FileMessage {
  fileName: string;
  fileType: string;
  fileData: string; // Base64
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, Button, TabsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
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
    this.activeUsers = this.searchUserObj
      ? this.tempUserList.filter(x => x.userName.includes(this.searchUserObj))
      : this.tempUserList;
  }

  setLoggedUserInfo() {
    this.loggedUser$.subscribe(user => {
      if (user) {
        this.loggedBy = user.userName;
        this.signalR.startConnection(this.loggedBy);

        this.signalR.onMessage((sender, msg) => this.handleMessage(sender, msg));
        this.signalR.onFile((sender, fileMsg) => this.handleFile(sender, fileMsg));

        this.signalR.onActiveUsers(users => {
          const activeUsers = users.filter(u => u !== this.loggedBy);
          this.activeUsers.forEach(item => item.isOnline = activeUsers.includes(item.userName));
        });
      }
    });
  }

  handleMessage(sender: string, msg: string) {
    let tab = this.chatTabs.find(t => t.user === sender);
    if (!tab) {
      tab = { user: sender, messages: [], newMessage: '', totalUnread: 0 };
      this.chatTabs.push(tab);
    }
    tab.messages.push({ sender, text: msg, isRead: false });
    const isActive = this.chatTabs.indexOf(tab) === this.activeTabIndex;
    if (!isActive) tab.totalUnread++;
  }

  handleFile(sender: string, fileMsg: FileMessage) {
    let tab = this.chatTabs.find(t => t.user === sender);
    if (!tab) {
      tab = { user: sender, messages: [], newMessage: '', totalUnread: 0 };
      this.chatTabs.push(tab);
    }
    tab.messages.push({
      sender,
      text: `Sent a file: ${fileMsg.fileName}`,
      isRead: false,
      file: fileMsg
    });
    const isActive = this.chatTabs.indexOf(tab) === this.activeTabIndex;
    if (!isActive) tab.totalUnread++;
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
    if (this.chatVisible) {
      this.getFinanceAndAccountUsers();
      this.setLoggedUserInfo();
    }
  }

  openChat(user: string) {
    let tab = this.chatTabs.find(t => t.user === user);
    if (!tab) {
      tab = { user, messages: [], newMessage: '', totalUnread: 0 };
      this.chatTabs.push(tab);
      setTimeout(() => this.activeTabIndex = this.chatTabs.length - 1);
    } else {
      this.activeTabIndex = this.chatTabs.indexOf(tab);
    }
    tab.totalUnread = 0;
    tab.messages.forEach(m => m.isRead = true);
  }

  send(tab: ChatTab) {
    if (!tab.newMessage.trim() && !tab.pendingFile) return;

    // Send text message
    if (tab.newMessage.trim()) {
      this.signalR.sendPrivateMessage(this.loggedBy, tab.user, tab.newMessage);
      tab.messages.push({ sender: this.loggedBy, text: tab.newMessage, isRead: true });
      tab.newMessage = '';
    }

    // Send file if any
    if (tab.pendingFile) {
      this.signalR.sendPrivateFile(this.loggedBy, tab.user, tab.pendingFile);
      tab.messages.push({
        sender: this.loggedBy,
        text: `Sent a file: ${tab.pendingFile.fileName}`,
        isRead: true,
        file: tab.pendingFile
      });
      tab.pendingFile = undefined;
    }
  }

  // onFileSelected(event: any, tab: ChatTab) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const fileMessage: FileMessage = {
  //       fileName: file.name,
  //       fileType: file.type,
  //       fileData: reader.result as string
  //     };

  //     this.signalR.sendPrivateFile(this.loggedBy, tab.user, fileMessage);
  //     tab.messages.push({
  //       sender: this.loggedBy,
  //       text: `Sent a file: ${file.name}`,
  //       isRead: true,
  //       file: fileMessage
  //     });
  //   };
  //   reader.readAsDataURL(file);
  // }

  closeTab(tab: ChatTab) {
    this.chatTabs = this.chatTabs.filter(x => x.user != tab.user);
  }

  onTabChange(index: any) {
    this.activeTabIndex = index;
    const tab = this.chatTabs[index];
    if (tab) {
      tab.totalUnread = 0;
      tab.messages.forEach(m => m.isRead = true);
    }
  }

  onFileSelected(event: any, tab: ChatTab) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      tab.pendingFile = {
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result as string
      };
    };
    reader.readAsDataURL(file);
  }

}
