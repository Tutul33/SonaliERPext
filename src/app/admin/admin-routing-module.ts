import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleMap } from './user-role-map/user-role-map';

const routes: Routes = [
  { path: '', redirectTo: 'user-role-map', pathMatch: 'full' },
  { path:'user-role-map',component:UserRoleMap }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
