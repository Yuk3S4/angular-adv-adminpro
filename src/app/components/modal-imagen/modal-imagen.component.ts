import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  imagenSubir!: File
  imgTemp: any = ''

  constructor(
    public modalImagenService: ModalImagenService,  
    public fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null
    this.modalImagenService.cerrarModal()
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

    const id = this.modalImagenService.id
    const tipo = this.modalImagenService.tipo
    
    this.fileUploadService.actualizarFoto( this.imagenSubir,  tipo, id )
                          .then(img => {                            
                            Swal.fire('Imágen guardada', 'La imágen se guardó correctamente', 'success')

                            this.modalImagenService.nuevaImagen.emit(img)

                            this.cerrarModal()
                          })
                          .catch( err => {
                            console.log(err)                            
                            Swal.fire('Error', 'No se pudo subir la imágen', 'error')
                          })
  }

}
