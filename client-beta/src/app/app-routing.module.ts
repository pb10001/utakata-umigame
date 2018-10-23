import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LobbyChatComponent } from './lobby-chat/lobby-chat.component';
import { ConfigComponent } from './config/config.component';
import { MondaiComponent} from './mondai/mondai.component';
import { MondaiEditorComponent } from './mondai-editor/mondai-editor.component';
import { AnswerEditorComponent } from './answer-editor/answer-editor.component';
import { LobbyEditorComponent } from './lobby-editor/lobby-editor.component';

const routes: Routes = [
  { path: '', component: LobbyChatComponent },
  { path: 'lobby', component: LobbyChatComponent },
  { path: 'mondai', component: ConfigComponent },
  { path: 'mondai/:id', component: MondaiComponent },
  { path: 'edit_mondai', component: MondaiEditorComponent },
  { path: 'lobby/edit', component: LobbyEditorComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
