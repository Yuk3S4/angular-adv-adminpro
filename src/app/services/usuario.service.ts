import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.prod';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario!: Usuario

  constructor( 
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || ''
  }

  logout() {
    localStorage.removeItem('token')
    
    google.accounts.id.revoke( '19041198@itdurango.edu.mx', () => {
      this.ngZone.run( () =>{
        this.router.navigateByUrl('/login');                
      })
    })
  }

  validarToken(): Observable<boolean> {
    google.accounts.id.initialize({
      client_id:
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.xxx',
    });    

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, name, role, uid, img = '' } = resp.usuario
        this.usuario = new Usuario( name, email, '', img, google, role, uid )
        localStorage.setItem('token', resp.token)
        return true
      }),
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

  updatePerfil( data: { email: string, name: string, role: string | undefined } ) {

    data = {
      ...data,
      role: this.usuario.role,
    }
    
    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    })

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
