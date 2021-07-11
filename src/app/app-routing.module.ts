import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from 'src/app/components/todo/home/home.component';
import { ListComponent } from 'src/app/components/todo/list/list.component'
import { EditCreateComponent } from './components/todo/edit-create/edit-create.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'list', component: ListComponent },

  { 
    canActivate: [AuthGuard],
    path: 'create-edit/:id', 
    component: EditCreateComponent },

  { path: 'create-edit', component: EditCreateComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
