import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsRoutingModule } from './components-routing.module';
import { ListComponent } from 'src/app/components/todo/list/list.component';
import { HomeComponent } from 'src/app/components/todo/home/home.component';
import { EditCreateComponent } from 'src/app/components/todo/edit-create/edit-create.component';


@NgModule({
  declarations: [
    ListComponent,
    HomeComponent,
    EditCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsRoutingModule
  ]
})
export class ComponentsModule { }
