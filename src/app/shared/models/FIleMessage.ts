export interface ChatTab {
  user: string;
  messages: ChatMessage[];
  newMessage: string;
  totalUnread: number;
  pendingFiles?: File[];
  previewFiles?: FileMessage[];
}
export interface ChatMessage {
  id?:number; 
  sender: string; 
  receiver: string;
  text: string; 
  isRead: boolean; 
  sentDate: Date; 
  files?: FileMessage[],
  tag:number,
  editing?:boolean
}
export interface FileMessage {
  id?:number;
  fileName: string;
  fileType: string;
  fileData: string; 
  fileUrl?: string; 
  sentDate?: Date;
  tag:number;
}