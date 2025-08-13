import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/component/toast/toast";
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from './shared/component/loading-spinner/loading-spinner';
import { Confirm } from "./shared/component/confirm/confirm";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, LoadingSpinner, CommonModule, Confirm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isLoggedIn:boolean=false;
  protected readonly title = signal('SolApp');
  constructor(){
  }

  ngOnInit(){
    
  }
}
