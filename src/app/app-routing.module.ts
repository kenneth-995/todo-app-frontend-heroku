import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from 'src/app/components/todo/home/home.component';
import { ListComponent } from 'src/app/components/todo/list/list.component'
import { CreateComponent } from './components/todo/create/create.component';
import { EditComponent } from './components/todo/edit/edit.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { 
    path: 'list',
    canActivate: [AuthGuard], 
    component: ListComponent },

  { 
    canActivate: [AuthGuard],
    path: 'create-edit/:id', 
    component: EditComponent },

  { 
    canActivate: [AuthGuard],
    path: 'create-edit', 
    component: EditComponent 
  },

  /* { 
    path: '', 
    canActivate: [AuthGuard],
    redirectTo: 'home', 
    pathMatch: 'full' }, */
  //{ path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
