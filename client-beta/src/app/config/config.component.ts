import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

@Component({
  providers: [UserService],
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  name;
  removePass;
  room;
  constructor( private userService: UserService ) { }

  ngOnInit() {
    this.name = this.userService.getName();
    this.removePass = this.userService.getRemovePass();
    this.room = this.userService.getRoom();
  }

  setName () {
    this.userService.setName(this.name);
  }

  setRemovePass () {
    this.userService.setRemovePass(this.removePass);
  }
}
