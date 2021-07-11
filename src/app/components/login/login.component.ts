import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userService:UserService) { }

  private destroy$ = new Subject();

  public loginForm: FormGroup;

  public messageForm: string = '';

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('jhon',[Validators.required]),
      password: new FormControl('password',[Validators.required])
    });
  }

  public login() {
    if (this.loginForm.valid) {
      
      this.userService.login(this.loginForm.value).pipe(takeUntil(this.destroy$)
        ).subscribe(res => {
          localStorage.setItem('accessToken', res['accessToken']);
          localStorage.setItem('username', res['username']);
          localStorage.setItem('id', res['id']);
          this.router.navigateByUrl('todo/list');
          },
          (error) => {
            if (error["status"] == 401){
              this.messageForm = "Invalid login or password";
            } else {
              this.messageForm = "Service not available, please try again";
            }
          }
        );
    } else {
      this.messageForm = "all fields ir required";
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
