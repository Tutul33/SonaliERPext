import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoEntry } from './demo-entry/demo-entry';

const routes: Routes = [
  {
      path:'demo-entry',
      component:DemoEntry
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
