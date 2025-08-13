import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../shared/component/header/header';
import { Authsvc } from '../shared/services/authsvc';
import { Sidebar } from '../shared/component/sidebar/sidebar';
import { Footer } from "../shared/component/footer/footer";
import { SidebartoggleDataService } from '../shared/services/sidebartoggle.data.service';

@Component({
  selector: 'app-default',
  imports: [CommonModule, Sidebar, Header, RouterOutlet, AsyncPipe, Footer],
  templateUrl: './default.html',
  styleUrl: './default.css'
})
export class Default {
  sidebarCollapsed = true;
  constructor(public auth:Authsvc,private router:Router,public sidebarCollapse: SidebartoggleDataService,){

  }
  
  ngOnInit(){
    this.sidebarCollapsed=false;
  }
 toggleSidebar(){
  this.sidebarCollapsed=!this.sidebarCollapsed;
 }
  logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
  }
}
