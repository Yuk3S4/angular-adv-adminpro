import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HospitalService {



  constructor(
    private http: HttpClient,  
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarHospitales( desde: number = 0 ) {
    
    const url = `${ base_url }/hospitales`
    return this.http.get<{ok: boolean, hospitales: Hospital[] }>(url, this.headers )
              .pipe(
                map( (resp: {ok: boolean, hospitales: Hospital[] }) => resp.hospitales)  
              )
    
  }

  crearHospital( name: string ) {
    
    const url = `${ base_url }/hospitales`
    return this.http.post(url, { name },this.headers )    
  }

  actualizarHospital( _id: string | undefined, name: string ) {
    
    const url = `${ base_url }/hospitales/${ _id }`
    return this.http.put(url, { name },this.headers )    
  }

  eliminarHospital( _id: string | undefined ) {
    
    const url = `${ base_url }/hospitales/${ _id }`
    return this.http.delete(url, this.headers )    
  }
}
