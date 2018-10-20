import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { SocketService } from '../socket.service';

@Component({
  providers: [ SocketService, UserService ],
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input()
   set subject(subject: string) {
     if (subject === 'mondai') {
       this._subject = '問題文';
     } else if (subject === 'trueAns') {
       this._subject = '解説'
     }
   }
   get subject(): string { return this._subject; }
  _subject: string;
  callback: string;
  content: string;

  constructor(
    private socketService: SocketService,
    private userService: UserService
   ) { }

  ngOnInit() {
    this.socketService.emit( 'join', this.userService.getRoom());
    this.socketService.emit('identify', this.userService.getName());
    this.content = this.userService.getCurrentContent();
    this.callback = '/mondai/' + this.userService.getRoom();
  }

  send() {
    if (this.subject === '問題文') {
      if (window.confirm('問題文が変更されます。続行しますか？')) {
        let data = {
          type: 'mondai',
          removePass: this.userService.getRemovePass() || '',
          content: this.content || '',
          created_month: new Date().getMonth() + 1,
          created_date: new Date().getDate()
        };
        this.socketService.emit('mondaiMessage', data);
      } else {
        window.alert('キャンセルしました。');
      }
    } else if (this.subject === '解説') {
      if (window.confirm('正解が公開されます。続行しますか？')) {
        let data = {
          type: 'trueAns',
          content: this.content
        };
        this.socketService.emit('trueAnsMessage', data);
      } else {
        window.alert('キャンセルしました。');
      }
    }
  }

}