import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators'

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  intervalSubs!: Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subs:', valor ), 
    //   err => console.warn('Error:', err),
    //   () => console.info('Obs terminado')
    // );
    this.intervalSubs = this.retornaIntervalo().subscribe( console.log )

  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {

    return interval(100)
                        .pipe(
                          map( valor => valor + 1 ), // para transformar o mutar la informacion a emitir
                          filter( valor => ( valor % 2 === 0 ) ? true : false ), // filtrar los valores a emitir
                          // take(10),  // número de valores a emitir
                        );
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>( observer => {  

      const interval = setInterval( () => {
          i++;             
          observer.next(i);

          if( i === 4 ) {
            clearInterval( interval ); // cancelar intervalos
            observer.complete();
          }

          if( i === 2 ) {
            observer.error('i llegó al valor de 2');
          }
      }, 1000 );

    });

  }

}
