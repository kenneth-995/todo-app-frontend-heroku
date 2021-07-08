import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import {LoginDto} from 'src/app/models/LoginDto';

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

  get getUserId() {
    return localStorage.getItem('id') || '';
  }
}
