import { Component } from '@angular/core';
import { Authsvc } from '../../services/authsvc';
import { Router } from '@angular/router';
import { SidebartoggleDataService } from '../../services/sidebartoggle.data.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(private authService:Authsvc,private router:Router,public sidebar:SidebartoggleDataService){
    
  }
  logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
  }
  toggleSidebar() {
    this.sidebar.toggleCollapsed();
  }
  
}
