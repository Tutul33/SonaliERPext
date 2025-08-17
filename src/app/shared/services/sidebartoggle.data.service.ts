import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebartoggleDataService {
  private isCollapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();

  // Add menuItems as BehaviorSubject
  public menuItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    {
      label: 'Dashboard',
      route: '/app/dashboard',
      children: [{ label: 'Home', route: '/app/dashboard/home' }]
    },
    {
      label: 'Users',
      route: '/app/admin',
      children: [{ label: 'User Role Map', hasAccess: true, route: '/app/admin/user-role-map' }]
    },
    { label: 'Check Pending', hasAccess: true, route: '/app/accounting/voucher-approval', queryParam: { status: 'check-pending' } },
    { label: 'Approval Pending', hasAccess: true, route: '/app/accounting/voucher-approval', queryParam: { status: 'approval-pending' } },
    { label: 'Referral Pending', hasAccess: true, route: '/app/accounting/voucher-approval', queryParam: { status: 'referral-pending' } }
  ]);

  public menuItems$: Observable<any[]> = this.menuItemsSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('isCollapsed');
    this.isCollapsedSubject.next(stored === 'true');
  }

  toggleCollapsed() {
    const isCollapsed = localStorage.getItem('isCollapsed');
    if (isCollapsed == "false") {
      localStorage.setItem('isCollapsed', 'true');
      this.isCollapsedSubject.next(true);
    } else {
      localStorage.setItem('isCollapsed', 'false');
      this.isCollapsedSubject.next(false);
    }
  }

  get isCollapsedValue(): boolean {
    return this.isCollapsedSubject.value;
  }

  // Optional: update menu dynamically
  updateMenuItems(items: any[]) {
    console.log('Menu Items:',items);
    this.menuItemsSubject.next(items);
  }
}
