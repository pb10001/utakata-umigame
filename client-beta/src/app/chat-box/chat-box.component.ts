import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  providers: [ UserService ],
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  @Input() msg;
  @Input() removePass:string;
  @Input() editable:Boolean;
  @Input() parent;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  getLink() {
    return '#' + this.msg.id;
  }
  editLobby() {
    console.log(this.msg);
    // this.editChat(this.msg.id, this.msg.content);
  }
  setId(id) {
    this.userService.setId(id);
    this.userService.setCurrentContent(this.msg.content);
  }
}
