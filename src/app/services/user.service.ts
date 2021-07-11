import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { LoginDto } from 'src/app/models/LoginDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public base_url = environment.CUSTOM_API_BASE_URL;

  constructor(private httpClient: HttpClient, private router: Router) {}

  public login(formData: LoginDto) {
    const url = `${this.base_url}/auth/login`;
    return this.httpClient.post(url, formData);
  }

  public getAllUsers(){
    const url = `${this.base_url}/user/`;
    return this.httpClient.get<User[]>(url);
  }

  public getUserById(id: number) {
    const url = `${this.base_url}/user/${id}`;
    return this.httpClient.get<User>(url);
  }

  get getUserIdLogged() {
    return Number(localStorage.getItem('id')) || 0;
  }

  public checkHasPermissionModidy(ownerId: number, userIdLogged: number): boolean {
    return ownerId === userIdLogged;
  }
}
