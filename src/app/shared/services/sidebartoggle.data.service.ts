import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebartoggleDataService {
   private isCollapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();
  
    constructor() {
       const stored = localStorage.getItem('isCollapsed');
       this.isCollapsedSubject.next(stored === 'true');
    }
  
    // Call this on login success
    toggleCollapsed() {
      const isCollapsed= localStorage.getItem('isCollapsed');
      if(isCollapsed=="false"){
        localStorage.setItem('isCollapsed', 'true');
        this.isCollapsedSubject.next(true);
      }
      else{
        localStorage.setItem('isCollapsed', 'false');
        this.isCollapsedSubject.next(false);
      }      
      
    }
  
  
    // Optional getter for current value
    get isCollapsedValue(): boolean {
      return this.isCollapsedSubject.value;
    }
}
