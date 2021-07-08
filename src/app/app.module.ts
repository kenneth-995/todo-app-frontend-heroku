import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from 'src/app/core/interceptors/auth.interceptor'
import { ListComponent } from './components/todo/list/list.component';
import { HomeComponent } from './components/todo/home/home.component';
import { CreateComponent } from './components/todo/create/create.component';
import { EditComponent } from './components/todo/edit/edit.component';
import { HeaderComponent } from 'src/app/shared-module/header/header.component';
import { LoginComponent } from './components/login/login.component'


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    HomeComponent,
    CreateComponent,
    EditComponent,
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
