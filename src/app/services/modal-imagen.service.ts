import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true
  tipo!: 'usuarios' | 'medicos' | 'hospitales'
  id: string = ''
  img: string = ''

  nuevaImagen: EventEmitter<string> = new EventEmitter<string>()

  get ocultarModal() {
    return  this._ocultarModal
  }

  abrirModal( 
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string = '',
    img: string = 'no-img'
  ) {
    this._ocultarModal = false
    this.tipo = tipo
    this.id = id
    // this.img = img
    // http://localhost:3001/api/v1/upload/medicos/1fceee8d-9b32-4d98-a34b-46d7d40b92f3.PNG
    if ( img.includes('https') ) {
      this.img = img
    } else {
      this.img = `${ base_url }/upload/${ tipo }/${ img }`
    }
  }

  cerrarModal() {
    this._ocultarModal = true
  }

  constructor() { }
}
