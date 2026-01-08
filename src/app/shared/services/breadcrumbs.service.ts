import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebartoggleDataService } from '../services/sidebartoggle.data.service';
import { Breadcrumb } from '../models/breadcrumb';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  public breadcrumbs: Breadcrumb[] = [];

  constructor(
    public router: Router,
    private sidebarService: SidebartoggleDataService
  ) {
    // Place the subscriptions here
    this.sidebarService.menuItemsSubject.subscribe(menu => {
      const currentUrl = this.router.url;
      debugger;
      this.breadcrumbs = this.buildBreadcrumbs(currentUrl);
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      debugger;
      this.breadcrumbs = this.buildBreadcrumbs(this.router.url);
    });
  }

  private buildBreadcrumbs(currentUrl: string): Breadcrumb[] {
    const menu = this.sidebarService.menuItemsSubject.value;
    debugger;
    
    const [path, queryString] = currentUrl.split("?");
    const params = new URLSearchParams(queryString);
    const status = params.get("status");

    const findCrumb = (items: any[], url: string, trail: Breadcrumb[] = []): Breadcrumb[] | null => {
      for (const item of items) {
        const newTrail = [...trail, { label: item.label, url: item.route }];

        if (item.route === url) {
          return newTrail;
        }

        if (item.children?.length) {
          const childTrail = findCrumb(item.children, url, newTrail);
          if (childTrail) return childTrail;
        }

        // Check query params if needed
        if (item.queryParam && item.queryParam.status==status && path==item.route) {
          return newTrail;
        }
        
      }
      return null;
    };

    return findCrumb(menu, currentUrl) || [];
  }
}
