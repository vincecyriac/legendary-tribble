import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  socket: any;
  token: any = localStorage.getItem('JWT_TOKEN');

  constructor(private authService: AuthService) { }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  //connect to the socket
  connect() {
    this.socket = io.connect('http://localhost:3000', {
      extraHeaders: {
        Authorization: this.token
      }
    });
  }

  //listen to events
  listen(eventname: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventname, (data: any) => {
        subscriber.next(data);
      })
    })
  }

  //emit event
  emit(eventname: string, data: any) {
    console.log(data);

    this.socket.emit(eventname, {
      data: data,
      time: new Date(),
      token: this.authService.getAccessToken()
    });
  }

  //stop listening to the event
  stopListening(eventname: string) {
    this.socket.disconnect();
  }
}
