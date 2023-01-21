import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.prod';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

declare const google: any;

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( 
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  logout() {
    localStorage.removeItem('token')
    
    google.accounts.id.revoke( '19041198@itdurango.edu.mx', () => {
      this.ngZone.run( () =>{
        this.router.navigateByUrl('/login');                
      })
    })
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true),
      catchError( err => of(false) )
    )
  }

  create( formData: RegisterForm ) {
    
    return this.http.post(`${ base_url }/usuarios`, formData )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })  
                )
    
  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })  
                )
  }

  loginGoogle( token: string ) {
    return this.http.post(`${ base_url }/login/google`, { token })
      .pipe(
        tap( (resp: any) => {          
          localStorage.setItem('token', resp.token)
        })    
      )
  }

}
