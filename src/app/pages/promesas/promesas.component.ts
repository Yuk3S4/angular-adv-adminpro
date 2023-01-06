import { Component, OnInit } from '@angular/core';
import { resolveObjectKey } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);      
    })

    // const promesa = new Promise( ( resolve, reject ) => {

    //   if( false ) {
    //     resolve('Hola Mundo');      
    //   } else {
    //     reject('Algo salió mal');
    //   }

      
    // });
    
    // promesa
    //   .then( (mensaje) => { // Lo que quiero hacer cuando la promesa se resuelve
    //   console.log(mensaje);           
    //   })
    //   .catch( err => console.log('Error en mi promesa', err));

    // console.log('Fin del Init');    

  }

  getUsuarios() {
    
    return new Promise( resolve => {
      fetch('https://reqres.in/api/users')
      .then( resp => resp.json() )
      .then( body => resolve(body.data) )
    });

  }

}
