import { Component } from '@angular/core';
import { SidebartoggleDataService } from '../../services/sidebartoggle.data.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        padding: '0.5rem 0'
      })),
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        padding: '0 0'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class Sidebar {
  menuItems:any[] = [
    {
      label: 'Dashboard',
      route: '/app/dashboard',
      children: [
        { label: 'Home', route: '/app/dashboard/home' }
      ]
    },
    {
      label: 'Users',
      route: '/app/admin',
      children: [
        { label: 'User Role Map', route: '/app/admin/user-role-map' }
      ]
    },
    // {
    //   label: 'Accounting',
    //   route: '/app/accounting',
    //   children: [
    //     { label: 'Check Pending', route: '/app/accounting/voucher-approval', queryParam: { status: 'check-pending' } },
    //     { label: 'Approval Pending', route: '/app/accounting/voucher-approval', queryParam: { status: 'approval-pending' } }
    //   ]
    // }
    { label: 'Check Pending', route: '/app/accounting/voucher-approval', queryParam: { status: 'check-pending' } },
    { label: 'Approval Pending', route: '/app/accounting/voucher-approval', queryParam: { status: 'approval-pending' } },
    { label: 'Referral Pending', route: '/app/accounting/voucher-approval', queryParam: { status: 'referral-pending' } }
  ];

  openMenuIndex: number | null = null;
  activeChildRoute: any = null;

  constructor(
    public sidebarCollapse: SidebartoggleDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveMenu();
      });

    // Initial activation
    this.updateActiveMenu();
  }
updateActiveMenu() {
  const currentUrl = this.router.url.split('?')[0];
  const queryParams = this.router.parseUrl(this.router.url).queryParams;

  this.openMenuIndex = null;
  this.activeChildRoute = null;

  this.menuItems.forEach((item, i) => {
    if (this.isRouteActive(item, currentUrl, queryParams)) {
      if (item.children?.length) {
        this.openMenuIndex = i;

        // Find the matching child route
        const activeChild = item.children.find(
          (child: any) =>
            currentUrl === child.route &&
            this.isQueryParamMatch(child.queryParam, queryParams)
        );

        if (activeChild) {
          this.activeChildRoute = activeChild;
        } else {
          // No child matched, maybe the parent route itself matches
          this.activeChildRoute = null;
        }
      } else {
        // No children: treat the parent item itself as active
        this.openMenuIndex = null;   // No submenu to open
        this.activeChildRoute = item;
      }
    }
  });
}

isRouteActive(item: any, currentUrl: string, queryParams: any): boolean {
  // Match parent route
  if (
    currentUrl === item.route &&
    this.isQueryParamMatch(item.queryParam, queryParams)
  ) {
    return true;
  }

  // Match any child route
  if (item.children?.length) {
    return item.children.some(
      (child: any) =>
        currentUrl === child.route &&
        this.isQueryParamMatch(child.queryParam, queryParams)
    );
  }

  return false;
}


  isQueryParamMatch(expected: any, actual: any): boolean {
    if (!expected) return true;
    return Object.keys(expected).every(
      (key) => expected[key] === actual[key]
    );
  }

  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  routeToPage(routeObj: any) {
    if (routeObj.queryParam == undefined) {
      this.router.navigate([routeObj.route]);
    } else {
      this.router.navigate([routeObj.route], {
        queryParams: routeObj.queryParam,
      });
    }
  }
}