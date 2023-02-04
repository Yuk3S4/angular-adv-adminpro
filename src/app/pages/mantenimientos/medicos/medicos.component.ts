import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

import { Medico } from '../../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  medicos: Medico[] = []
  medicosTemp: Medico[] = []
  cargando: boolean = true
  private imgSubs!: Subscription

  constructor(
    private medicosService: MedicoService,  
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarMedicos()

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100) 
      )
      .subscribe( img => this.cargarMedicos())
  }

  cargarMedicos() {
    this.cargando = true
    this.medicosService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false,
          this.medicos = medicos
          this.medicosTemp = medicos
        })
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img );
  }

  buscar( termino: string ) {
    if ( termino.length === 0 ) {
      return this.medicos = this.medicosTemp
    }

    this.busquedasService.buscar('medicos', termino)
        .subscribe( resultados => {
          this.medicos = resultados as Medico[]
        })

    return []  
  }

  borrarMedico( medico: Medico ) {
    
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.medicosService.eliminarMedico( medico._id )
            .subscribe( resp => {
              this.cargarMedicos()
              Swal.fire('Médico borrado', `${ medico.name } fue eliminado correctamente`, 'success') 
            })

      }
    })

  }

}
