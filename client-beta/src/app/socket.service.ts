import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() {
    this.connect();
  }

  private socket;

  connect () {
    this.socket = io(environment.socketUrl);
  }

  emit ( emitName: string, data? ) {
    this.socket.emit( emitName, data );
  }

  on ( onName: string ) {
    let observable = new Observable( observer => {
      this.socket.on( onName, ( data ) => {
        observer.next( data );
      });

      return () => { this.socket.disconnect(); };
    } );
    return observable;
  }
}
