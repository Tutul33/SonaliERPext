import { AfterViewChecked, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { SignalRService } from '../../services/signalr-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { TabsModule } from 'primeng/tabs';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth.selectors';
import { Observable } from 'rxjs';
import { ChatTab, FileMessage, ChatMessage } from '../../models/FIleMessage';
import { EntityState, GlobalMethods } from '../../models/javascriptMethods';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, Button, TabsModule, FileUploadModule, ImageModule],
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
  fileUrl: any = GlobalMethods.FileUrl();

  @ViewChildren('chatMessagesContainer') chatContainers!: QueryList<ElementRef>;

  constructor(private store: Store, private signalR: SignalRService) {
    this.loggedUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit() {
    this.getFinanceAndAccountUsers();
    this.setLoggedUserInfo();
  }

  loadMessages(tab: ChatTab, page: number) {
    this.signalR.getMessages(this.loggedBy, tab.user, page, 20)
      .subscribe(msgs => {
        tab.messages = [...msgs, ...tab.messages]; // prepend older messages
      });
  }

  onScroll(event: any, tab: ChatTab) {
  const element = event.target;
  if (element.scrollTop === 0) {
    tab.page = (tab.page || 1) + 1; // next page
    this.loadMessages(tab, tab.page);
  }
}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      const el = this.chatContainers.toArray()[this.activeTabIndex]?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { }
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  getFinanceAndAccountUsers() {
    this.signalR.GetFinanceAndAccountUsers().subscribe(res => {
      const list = res?.data?.list ?? [];
      this.activeUsers = list.filter(x => x.userName !== this.loggedBy)
        .map(u => ({ userName: u.userName, isOnline: false }));
      this.tempUserList = [...this.activeUsers];
    });
  }

  searchUser() {
    this.activeUsers = this.searchUserObj
      ? this.tempUserList.filter(x => x.userName.includes(this.searchUserObj))
      : [...this.tempUserList];
  }

  setLoggedUserInfo() {
    this.loggedUser$.subscribe(user => {
      if (!user) return;
      this.loggedBy = user.userName;
      this.signalR.startConnection(this.loggedBy);

      this.signalR.onMessage((sender, msg) => this.handleMessage(sender, msg));
      this.signalR.onFile((sender, files) => this.handleFile(sender, files));
      this.signalR.onMessageUpdate((msg) => this.applyUpdatedMessage(msg));
      this.signalR.onActiveUsers(users => {
        const activeUserNames = users.filter(u => u !== this.loggedBy);
        this.activeUsers.forEach(u => u.isOnline = activeUserNames.includes(u.userName));
      });
    });
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

  handleMessage(sender: string, msg: ChatMessage) {
    let tab = this.chatTabs.find(t => t.user === sender);
    if (!tab) {
      tab = { user: sender, messages: [], newMessage: '', totalUnread: 0 };
      this.chatTabs.push(tab);
    }
    tab.messages.push(msg);
    if (this.chatTabs.indexOf(tab) !== this.activeTabIndex) tab.totalUnread++;
  }

  handleFile(sender: string, files: FileMessage[]) {
    let tab = this.chatTabs.find(t => t.user === sender);
    if (!tab) {
      tab = { user: sender, messages: [], newMessage: '', totalUnread: 0 };
      this.chatTabs.push(tab);
    }
    tab.messages.push({
      sender,
      receiver: sender,
      text: `Sent ${files.length} file(s)`,
      isRead: false,
      files,
      sentDate: new Date(),
      tag: EntityState.Added
    });
    if (this.chatTabs.indexOf(tab) !== this.activeTabIndex) tab.totalUnread++;
  }

  send(tab: ChatTab) {
    // Multiple files + message
    if ((tab.newMessage?.trim() || tab.pendingFiles?.length > 0) && tab.pendingFiles?.length) {
      this.signalR.uploadChatFiles(this.loggedBy, tab.user, Array.from(tab.pendingFiles), tab.newMessage)
        .subscribe({
          next: (fileMessages) => {
            const msg: ChatMessage = {
              sender: this.loggedBy,
              receiver: tab.user,
              text: tab.newMessage || `Sent ${fileMessages.length} files`,
              files: fileMessages,
              isRead: true,
              sentDate: new Date(),
              tag: EntityState.Added
            };
            tab.messages.push(msg);
            tab.pendingFiles = undefined;
            tab.previewFiles = undefined;
            tab.newMessage = '';
          },
          error: err => console.error(err)
        });
    }
    // Text only
    else if (tab.newMessage?.trim()) {
      const msg: ChatMessage = {
        sender: this.loggedBy,
        receiver: tab.user,
        text: tab.newMessage,
        isRead: true,
        sentDate: new Date(),
        tag: EntityState.Added
      };
      this.signalR.sendPrivateMessage(this.loggedBy, tab.user, tab.newMessage);
      tab.messages.push(msg);
      tab.newMessage = '';
    }
  }

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

  onFilesSelected(event: any, tab: ChatTab) {
    if (!event || !event.files?.length) return;
    tab.pendingFiles = event.files;
    tab.previewFiles = [];
    event.files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        tab.previewFiles?.push({
          fileName: file.name,
          fileType: file.type,
          fileData: reader.result as string,
          sentDate: new Date(),
          tag: EntityState.Added
        });
      };
      reader.readAsDataURL(file);
    });
  }

  deleteFile(tab: ChatTab, file: FileMessage) {
    if (file.id) {
      this.signalR.deleteFile(file.id).subscribe(() => {
        tab.messages.forEach(m => m.files = m.files?.filter(f => f.id !== file.id));
      });
    } else {
      tab.previewFiles = tab.previewFiles?.filter(f => f !== file);
      tab.pendingFiles = tab.pendingFiles?.filter(f => f.name !== file.fileName);
    }
  }

  editMessage(tab: ChatTab, msg: ChatMessage) {
    msg.editing = true;
  }

  saveMessage(tab: ChatTab, msg: ChatMessage) {
    this.signalR.updateMessage(msg).subscribe({
      next: updated => Object.assign(msg, updated),
      error: err => console.error(err)
    });
    msg.editing = false;
  }

  cancelEdit(msg: ChatMessage) {
    msg.editing = false;
  }

  applyUpdatedMessage(msg: ChatMessage) {
    const tab = this.chatTabs.find(t => t.user === msg.receiver || t.user === msg.sender);
    if (!tab) return;
    const message = tab.messages.find(m => m.id === msg.id);
    if (message) Object.assign(message, msg);
  }

  download(file: FileMessage) {
    try {
      const fileType = file.fileName.split('.').pop() || '';
      this.signalR.download(fileType, file.fileUrl || file.fileName);
    } catch { }
  }
}
