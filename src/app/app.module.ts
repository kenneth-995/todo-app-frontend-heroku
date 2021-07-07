import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ListComponent } from './components/todo/list/list.component';
import { HomeComponent } from './components/todo/home/home.component';
import { CreateComponent } from './components/todo/create/create.component';
import { EditComponent } from './components/todo/edit/edit.component';


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    HomeComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
