import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from 'src/app/components/todo/home/home.component';
import { ListComponent } from 'src/app/components/todo/list/list.component'
import { CreateComponent } from './components/todo/create/create.component';
import { EditComponent } from './components/todo/edit/edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list', component: ListComponent },
  { path: 'create-edit/:id', component: EditComponent },
  { path: 'create-edit', component: EditComponent },
  //{ path: 'edit/:id', component: EditComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  //{ path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
