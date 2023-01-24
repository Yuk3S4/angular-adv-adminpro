import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  perfilForm: FormGroup = new FormGroup({})
  usuario!: Usuario
  imagenSubir!: File
  imgTemp: any = ''

  constructor( 
    private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
  ) { 

    this.usuario = usuarioService.usuario

  }

  ngOnInit(): void {
    this.perfilForm = this.formBuilder.group({
      name: [ this.usuario.name, Validators.required],
      email: [ this.usuario.email, [Validators.required, Validators.email]],
    })
  }

  actualizarPerfil() {
    this.usuarioService.updatePerfil(this.perfilForm.value)
      .subscribe( () => {
        const {name, email} = this.perfilForm.value
        this.usuario.name = name
        this.usuario.email = email

        Swal.fire('Guardado', 'Cambios fueron guardados', 'success')
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error')
      })
  }

  cambiarImagen( file: File ) {
    this.imagenSubir = file

    if( !file ) { 
      this.imgTemp = null
      return 
    }

    const reader = new FileReader()
    const url64 = reader.readAsDataURL( file )

    reader.onloadend = () => {
      this.imgTemp = reader.result      
    }

  }

  subirImagen() {
    this.fileUploadService.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
                          .then(img => {
                            this.usuario.img = img
                            Swal.fire('Imágen guardada', 'La imágen se guardó correctamente', 'success')
                          })
                          .catch( err => {
                            Swal.fire('Error', 'No se pudo subir la imágen', 'error')
                          })
  }

}
