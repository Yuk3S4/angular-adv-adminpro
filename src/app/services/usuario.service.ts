import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.prod';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
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

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' | undefined {
    return this.usuario.role
  }

  get uid(): string {
    return this.usuario.uid || ''
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage( token: string, menu: any ) {
    localStorage.setItem('token', token)
    localStorage.setItem('menu', JSON.stringify(menu))
  }

  logout() {

    // TODO: Borrar menu

    localStorage.removeItem('token')
    localStorage.removeItem('menu')
    
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

        this.guardarLocalStorage(resp.token, resp.menu )

        return true
      }),
      catchError( err => of(false) )
    )
  }

  create( formData: RegisterForm ) {
    
    return this.http.post(`${ base_url }/usuarios`, formData )
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu )
                  })  
                )
    
  }

  updatePerfil( data: { email: string, name: string, role: string | undefined } ) {

    data = {
      ...data,
      role: this.usuario.role,
    }
    
    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers)

  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu )
                  })  
                )
  }

  loginGoogle( token: string ) {
    return this.http.post(`${ base_url }/login/google`, { token })
      .pipe(
        tap( (resp: any) => {          
          this.guardarLocalStorage(resp.token, resp.menu )
        })    
      )
  }

  cargarUsuarios( desde: number = 0 ) {
    
    const url = `${ base_url }/usuarios?desde=${ desde }`
    return this.http.get<CargarUsuario>(url, this.headers )
                    .pipe(
                      map( resp => {
                        const usuarios = resp.usuarios.map( 
                          u => new Usuario(u.name, u.email, '', u.img, u.google, u.role, u.uid)
                        )

                        return {
                          total: resp.total,
                          usuarios
                        }
                      })  
                    )

  }

  eliminarUsuario( usuario: Usuario ) {

    // http://localhost:3001/api/v1/usuarios/63bcf94125dcf040005f7653
    const url = `${ base_url }/usuarios/${ usuario.uid }`
    return this.http.delete(url, this.headers )
    
  }

  guardarUsuario( usuario: Usuario ) {
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers)
  }

}
