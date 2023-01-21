import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmitted = false

  registerForm = this.formBuilder.group({
    name: ['Daniel', [ Validators.required, Validators.minLength(3) ] ],
    email: ['test100@correo.com', [Validators.required, Validators.email] ],
    password: ['123456', Validators.required ],
    password2: ['123456', Validators.required ],
    terminos: [true, Validators.required ],
  }, {
    validators: this.passwordsIguales('password', 'password2')
  })

  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
  ) { }

  crearUsuario() {
    this.formSubmitted = true
    
    if ( this.registerForm.invalid ) {
      return      
    } 

    // Creación
    this.usuarioService.create( this.registerForm.value )
        .subscribe( resp => {
          this.router.navigateByUrl('/');             
        }, (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error')
        })
  }

  campoNoValido( campo: string ): boolean {
    
    if( this.registerForm.get( campo )?.invalid && this.formSubmitted ) {
      return true
    } else {
      return false
    }

  }

  contarsenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value
    const pass2 = this.registerForm.get('password2')?.value

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true
    } else {
      return false
    }

  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {

    return ( formGroup: FormGroup ) => {
    
      const pass1Control = formGroup.get(pass1Name)
      const pass2Control = formGroup.get(pass2Name)

      if ( pass1Control?.value === pass2Control?.value ) {
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ noEsIgual: true })
      }

    }

  }

}
