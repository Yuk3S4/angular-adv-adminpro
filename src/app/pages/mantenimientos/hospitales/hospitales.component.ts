import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  hospitales: Hospital[] = []
  hospitalesTemp: Hospital[] = []
  cargando: boolean = true
  private imgSubs!: Subscription

  constructor(
    private hospitalService: HospitalService,  
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarHospitales()

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100) 
      )
      .subscribe( img => this.cargarHospitales())
  }

  cargarHospitales() {
    this.cargando = true
    this.hospitalService.cargarHospitales()
        .subscribe(hospitales => {
          this.cargando = false
          this.hospitalesTemp = hospitales
          this.hospitales = hospitales
        })
  }

  guardarCambios( hospital: Hospital ) {
    
    this.hospitalService.actualizarHospital( hospital._id, hospital.name )
        .subscribe( resp => {
          Swal.fire('Actualizado', hospital.name, 'success' )
        })    

  }

  eliminarHospital( hospital: Hospital ) {
    
    this.hospitalService.eliminarHospital( hospital._id )
        .subscribe( resp => {
          this.cargarHospitales()
          Swal.fire('Borrado', hospital.name, 'success' )
        })    

  }

  async abrirSweetModal() {
    const { value } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })
    
    if ( value && value.trim().length > 0 ) {
      this.hospitalService.crearHospital( value )
          .subscribe( (resp: any) => {
            this.hospitales.push( resp.hospital )
          })
    }
    
  }

  abrirModal( hospital: Hospital ) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img );
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.hospitales = this.hospitalesTemp
    }

    this.busquedasService.buscar('hospitales', termino)
        .subscribe( resultados => {
          this.hospitales = resultados as Hospital[]
        })

    return []  
    
  }

}
