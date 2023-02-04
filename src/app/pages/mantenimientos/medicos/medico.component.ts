import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  medicoForm: FormGroup = new FormGroup({})
  hospitales: Hospital[] = []

  medicoSeleccionado!: Medico
  hospitalSeleccionado: Hospital | undefined

  constructor(
    private formBuilder: FormBuilder,  
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.cargarHospitales()

    this.activatedRoute.params
        .subscribe( ({ id }) => this.cargarMedico( id ) )    

    this.medicoForm = this.formBuilder.group({
      name: ['', Validators.required],
      hospital: ['', Validators.required],
    })

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe( hospitalID => {        
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalID )
      })

  }

  cargarMedico( id: string ) {

    if ( id === 'nuevo' ) {
      return;
    }

    this.medicoService.obtenerMedicoID( id )
        .pipe(
          delay(100)
        )
        .subscribe( (medico: any) => {
          
          if (!medico) {
            return this.router.navigateByUrl(`/dashboard/medicos`)
          }
          const { name, hospital:{ _id } } = medico          
          this.medicoSeleccionado = medico
          this.medicoForm.setValue({ name, hospital: _id })
          return
        })
  }

  cargarHospitales() {
    
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales
      })

  }

  guardarMedico() {
    const { name } = this.medicoForm.value

    if (this.medicoSeleccionado) {
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      }
      this.medicoService.actualizarMedico( data )
          .subscribe( resp => {
            Swal.fire('Actualizado', `${ name } actualizado correctamente`, 'success')
          })
    } else {
      // crear      
      this.medicoService.crearMedico( this.medicoForm.value )
        .subscribe( (resp: any) => {
          Swal.fire('Creado', `${ name } creado correctamente`, 'success')
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
        })
    }

    
    
  }

}
