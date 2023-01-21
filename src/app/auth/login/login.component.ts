import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef

  loginForm!: FormGroup;
  constructor( 
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone,
  ) { 

    this.loginForm = this.formBuilder.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
      password: ['', Validators.required ],
      remember: [false]
    })

  }

  ngAfterViewInit(): void {
    this.googleInit()
  }

  googleInit() {
    
    google.accounts.id.initialize({
      client_id: "94425682202-6is5802kqj2rjh7j0nan7jjcqu31tgbp.apps.googleusercontent.com",
      callback: (resp: any) => this.handleCredentialResponse(resp)
    });

    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
    
  }

  handleCredentialResponse( response: any ) {
    console.log("Encoded JWT ID token: " + response.credential)
    this.usuarioService.loginGoogle( response.credential )
      .subscribe( resp => {
        this.ngZone.run( () =>{
          this.router.navigateByUrl('/');                
        })
      })
  }

  login() {
    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {
        
          if( this.loginForm.get('remember')?.value ) {
            localStorage.setItem('email', this.loginForm.get('email')?.value )
          } else {
            localStorage.removeItem('email')
          }

          // Navegar al Dashboard
          this.router.navigateByUrl('/');

      }, (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.msg, 'error')
      })

    
  }

}
