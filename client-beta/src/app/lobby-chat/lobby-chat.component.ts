import { Component, OnInit, OnDestroy } from '@angular/core';

import { SocketService }     from '../socket.service';
import { UserService }       from '../user.service';

import * as moment from 'moment'

@Component({
  providers: [SocketService, UserService],
  selector: 'app-lobby-chat',
  templateUrl: './lobby-chat.component.html',
  styleUrls: ['./lobby-chat.component.css']
})
export class LobbyChatComponent implements OnInit, OnDestroy {

  self = this;
  user;
  roomName: string;
  currentRoom: string;
  name: string;
  removePass: string;
  text: string;
  roster = [];
  messages = [];
  allMessages = [];
  connections = [];
  status: string = '再接続';
  page: number = 0;
  perPage:number = 5;
  perPages = [5, 10, 20, 50, 100, 200, 500, 1000];
  constructor(
    private socketService: SocketService,
    private userService: UserService ) { }

  ngOnInit() {
    if (this.status === '通信中') return;
    this.socketService.emit('join', 'LobbyChat');
    this.name = this.userService.getName();
    this.removePass = this.userService.getRemovePass();
    this.currentRoom = this.userService.getRoom();
    this.perPage = this.userService.getPerPage();
    this.setName();
    this.subscribe('connect', () => {
      // this.socketService.emit('join', 'LobbyChat');
      this.status = '通信中';
    });
    this.subscribe('join', () => {
      this.status = '通信中';
      this.socketService.emit('fetchLobby');
    });
    this.subscribe('lobbyChat', msg => {
      this.allMessages = msg;
      this.refresh(msg);
    });
    this.subscribe('roster', msg => {
      this.roster = msg;
    });
    this.subscribe('disconnect', () => {
      console.log('WTF the connection is aborted');
      this.status = '再接続';
    });
  }

  ngOnDestroy() {
    this.connections.forEach(x => x.unsubscribe());
    this.socketService.emit('disconnect');
  }

  subscribe ( name, callback ) {
    this.connections.push(this.socketService.on( name ).subscribe( callback ));
  }

  send() {
    let data = {
      type: 'lobbyChat',
      name: this.name,
      content: this.text,
      removePass: this.removePass
    };
    console.log('Sending message:', data);
    this.socketService.emit('lobbyMessage', data);
    this.text = '';
  }

  setName() {
    this.socketService.emit('identify', this.name);
    this.userService.setName(this.name);
  }

  editChat(id, content) {
    let data = {
      id: id,
      content: content,
      removePass: this.removePass
    };
    this.socketService.emit('editLobby', data);
  }

  removeChat(id) {
    let data = {
      id: id,
      removePass: this.removePass
    };
    this.socketService.emit('removeLobby', data);
  }

  zeroPage() {
    this.page = 0;
    this.refresh(this.allMessages);
  }

  nextPage() {
    this.page += 1;
    this.refresh(this.allMessages);
  }

  prevPage() {
    if (this.page == 0) return;
    this.page -= 1;
    this.refresh(this.allMessages);
  }

  movePage(num) {
    if (num < 0) return;
    this.page = num;
    this.refresh(this.allMessages);
  }

  onPerPageChanged(num) {
    this.userService.setPerPage(this.perPage);
    this.movePage(num);
  }

  reload() {
    this.socketService.emit('fetchLobby');
  }

  refresh(msg) {
    let tmp = [];
    //ページネーション
    for (let i = 0; i < this.perPage; i++) {
      tmp.push(msg[this.page * this.perPage + i]);
    }
    tmp.map(msg => {
      if (msg) msg.relDate = moment(msg.date).fromNow();
    })
    this.messages = [];
    for (let key in tmp) {
      if (tmp[key] !== undefined) this.messages.push(tmp[key]);
    }
  }
}
