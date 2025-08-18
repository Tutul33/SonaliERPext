import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalMethods } from '../models/javascriptMethods';

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
      hasAccess: true,
      children: [{ label: 'Home', hasAccess: true, route: '/app/dashboard/home' }]
    },
    {
      label: 'Users',
      route: '/app/admin',
      hasAccess: false,
      children: [{ label: 'User Role Map', hasAccess: false, route: '/app/admin/user-role-map' }]
    },
    { label: 'Check Pending', hasAccess: false, route: '/app/accounting/voucher-approval', queryParam: { status: 'check-pending' } },
    { label: 'Approval Pending', hasAccess: false, route: '/app/accounting/voucher-approval', queryParam: { status: 'approval-pending' } },
    { label: 'Referral Pending', hasAccess: false, route: '/app/accounting/voucher-approval', queryParam: { status: 'referral-pending' } }
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
  updateMenuItems(userInfo) {
    const roleList = userInfo.roleList;
    const updatedMenu = this.menuItemsSubject.value.map(item => {
      if (item.children?.length) {
        item.hasAccess = this.defineAccess(userInfo, item, roleList);
        item.children = item.children.map(child => ({
          ...child,
          hasAccess: this.defineAccess(userInfo, child, roleList)
        }));
      } else {          
          item.hasAccess = this.defineAccess(userInfo, item, roleList);        
      }
      return item;
    });
    this.menuItemsSubject.next(updatedMenu);
  }

  private defineAccess(userInfo: any, item: any, roleList: any) {
    try {
      if(item.label.includes('Dashboard')){
        return true;
      }
      if (userInfo.payRoleName == GlobalMethods.roleAdmin )
      {
        return true;
      }

      if (roleList.find(x => item.label.includes(x.roleName))) {
        return true
      } else {
        return false;
      };
    } catch (error) {
       return false;
    }
  }
}
