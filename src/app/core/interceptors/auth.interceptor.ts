import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private route: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem('accessToken') || '';

    if (localStorage.getItem('accessToken')) {
      request = request.clone(
        {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + token,
          })
        });
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      console.info('[AuthService.ts] working');      
      if (error.status == 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        this.route.navigateByUrl('/login')
      };
      if (error.status == 404) {
        console.info('RESOURCE NOT FOUND')
      };
      
      return next.handle(request)
    }));
  }
}
