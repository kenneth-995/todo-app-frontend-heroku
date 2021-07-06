import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from 'src/app/components/todo/home/home.component';
import { ListComponent } from 'src/app/components/todo/list/list.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list', component: ListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
