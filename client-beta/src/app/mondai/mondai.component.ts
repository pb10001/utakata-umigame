import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { SocketService }       from '../socket.service';
import { UserService }       from '../user.service';

@Component({
  providers: [SocketService, UserService],
  selector: 'app-mondai',
  templateUrl: './mondai.component.html',
  styleUrls: ['./mondai.component.css']
})
export class MondaiComponent implements OnInit, OnDestroy {

  connections = [];
  mondai = {
    sender : '',
    content : '',
    room : ''
  };
  messages = [];
  privateMessages = [];
  roster = [];
  currentRoom:String;
  name: String;
  removePass: String;
  trueAns: String;
  status: String;
  text: String;
  publicText: String;
  answer: String;
  mode = 'ques';
  refresh: number;
  currentId: number;
  isGood: Boolean;
  isTrueAns: Boolean;
  ques: String;
  quesId: String;
  quesMsg: String;

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location) { }

  onClick (){
  }

  ngOnInit () {
    this.currentRoom = this.route.snapshot.paramMap.get('id');;
    this.socketService.connect()
    this.subscribe( 'mondai',  data => {
      this.mondai = data;
    });
    this.subscribe( 'join', data => {
      this.mondai.room = data;
      this.status = '通信中';
    });
    this.subscribe( 'trueAns', data => {
      this.trueAns = data || '解説';
    });
    this.subscribe( 'message', () => {
      this.refresh++;
      let elem = document.getElementById('question-area');
      elem.scrollTop = elem.scrollHeight;
    });
    this.subscribe( 'refreshMessage', data => {
      this.messages = data;
      let elem = document.getElementById('question-area');
      elem.scrollTop = elem.scrollHeight;
      this.refresh = 0;
    });
    this.subscribe( 'roster', data => {
      this.roster = data;
    });
    this.subscribe( 'chatMessage', data => {
      this.privateMessages.push(data);
      let elem = document.getElementById('private-chat-area');
      elem.scrollTop = elem.scrollHeight;
    });
    this.subscribe( 'clearChat', () => {
      let privates = this.privateMessages.filter(x => x.private);
      let self = this;
      this.privateMessages = [];
      privates.forEach( item => {
        self.privateMessages.push(item);
      });
    });
    this.subscribe( 'loadChat', data => {
      this.privateMessages = [];
      let self =this;
      data.forEach(function(item) {
        self.privateMessages.push(item);
      });
    });
    this.subscribe( 'disconnect', () => {
      console.log('WTF the connection was aborted');
      this.status = '再接続';
    });

    this.socketService.emit('join', this.currentRoom);
    this.name = this.userService.getName();
    this.removePass = this.userService.getRemovePass();
    this.userService.setRoom('a');
    this.setName();
  }

  subscribe ( name, callback ) {
    this.connections.push(this.socketService.on( name ).subscribe( callback ));
  }

  send () {
    let data = {
      type: 'question',
      question: this.text,
      answer: 'waiting an answer'
    };
    console.log('Sending message:', data);
    this.socketService.emit('questionMessage', data);
    this.text = '';
  }

  sendAnswer () {
    // let id = document.getElementById('ques_id_input').value || 0;
    let id = this.quesId||0;
    let data = {
      type: 'answer',
      answerer: String(this.name || 'Anonymous'),
      id: id,
      isGood: this.isGood,
      isTrueAns: this.isTrueAns,
      answer: this.answer
    };
    console.log('Sending message:', data);
    this.socketService.emit('answerMessage', data);
    this.answer = '';
  }

  sendPublicMessage () {
    let data = {
      type: 'publicMessage',
      removePass: this.removePass,
      content: this.publicText
    };
    console.log('Sending message:', data);
    this.socketService.emit('publicChatMessage', data);
    this.publicText = '';
  }

  removeChat (id) {
    var data = {
      id: id,
      removePass: this.removePass
    };
    this.socketService.emit('removeMondaiChat', data);
  }

  editChat (id, content) {
    let data = {
      id: id,
      content: content,
      removePass: this.removePass
    };
    this.socketService.emit('editMondaiChat', data);
  }

  setName () {
    // let doc = this.name.split('#');
    let txt = this.name;
    /* if (doc.length == 2) {
      let sha1 = crypto.createHash('sha1');
      sha1.update(doc[1]);
      var hash = sha1.digest('hex');
      let txt = doc[0] + '◆' + window.btoa(hash).substr(1, 10);
    } else {
      let txt = doc[0];
    } */
    this.userService.setName(txt);
    this.socketService.emit('identify', txt);
  }

  setRemovePass () {
    this.userService.setRemovePass(this.removePass);
  }

  fetchData () {
    this.socketService.emit('refresh', null);
    this.refresh = 0;
  }

  quit () {
    this.connections.forEach(x => x.unsubscribe());
  }

  clearAll () {
    if (window.confirm('問題、質問、回答がすべて消えます。続行しますか？')) {
      this.socketService.emit('clear', this.removePass);
    } else {
      window.alert('キャンセルしました。');
    }
  }

  addLink () {
    if (window.confirm('ルーム名が公開されます。リンクを貼りますか？')) {
      var data = {
        type: 'lobbyChat',
        name: this.name,
        content: '【出題中】',
        removePass: this.removePass,
        link: this.userService.getRoom()
      };
      console.log('Sending message:', data);
      this.socketService.emit('lobbyMessage', data);
    } else {
      window.alert('キャンセルしました。');
    }
  }

  setQues (msg) {
    this.ques = msg.questionNum;
    this.quesId = msg.id;
    this.quesMsg = msg.text
  }

  setContent (content) {
    this.userService.setCurrentContent(content);
  }

  ngOnDestroy() {
    this.connections.forEach(x => x.unsubscribe());
  }

}
