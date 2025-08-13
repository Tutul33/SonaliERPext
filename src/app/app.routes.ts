import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Default } from './default/default';
import { authGuard } from './shared/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'app',
    component: Default,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)
      },
      {
        path: 'accounting',
        loadChildren: () => import('./accounting/accounting-module').then(m => m.AccountingModule)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
