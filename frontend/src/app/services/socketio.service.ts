import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: Socket

  constructor() { }

  connect(gameId) {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('joinGame', { gameId: gameId });
  }

  startGame(gameId) {
    this.socket.emit('startGame', { gameId: gameId });
  }

  // sendGameUpdate(gameId, words) {
  //   this.socket.emit('gameUpdate', { gameId: gameId, words: words });
  // }

  recieveJoinedPlayers() {
    return new Observable((observer) => {
      debugger
      this.socket.on('joinGame', (message) => {
        observer.next(message);
      });
    });
  }

  recieveStartGame() {
    return new Observable((observer) => {
      this.socket.on('startGame', (words) => {
        observer.next(words);
      });
    });
  }

  // recieveGameUpdate(gameId) {
  //   return new Observable((observer) => {
  //     this.socket.on(gameId, (words) => {
  //       observer.next(words);
  //     });
  //   });
  // }
}
