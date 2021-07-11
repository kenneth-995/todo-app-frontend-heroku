import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HomeComponent } from 'src/app/components/todo/home/home.component';
import { ListComponent } from 'src/app/components/todo/list/list.component'
import { EditCreateComponent } from 'src/app/components/todo/edit-create/edit-create.component';

const routes: Routes = [

  { path: '', redirectTo: 'list', pathMatch: 'full' },
  
  { path: 'home', component: HomeComponent },

  { path: 'list', component: ListComponent },

  { 
    canActivate: [AuthGuard],
    path: 'create-edit/:id', 
    component: EditCreateComponent 
  },

  { path: 'create-edit', component: EditCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
