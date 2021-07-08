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


  public loginForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });


  ngOnInit(): void {

  }

  public login() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      
      this.userService.login(this.loginForm.value).pipe(takeUntil(this.destroy$)
        ).subscribe(res => {
          localStorage.setItem('accessToken', res['accessToken']);
          localStorage.setItem('username', res['username']);
          localStorage.setItem('id', res['id']);
          console.log(res)
          this.router.navigateByUrl('/home');
        
          },
          (error) => {
            if (error["status"] == 401){
              console.log("Username or password do not match");
            }
          }
        );
    } else {
      console.log('form no valid');

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
