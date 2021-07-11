import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

const routes: Routes = [

  { path: '', redirectTo: 'todo', pathMatch: 'full' },

  { 
    path: 'todo', 
    loadChildren:() => 
      import('src/app/components/components.module').then(m=> m.ComponentsModule) 
  },

  { path: 'login', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
