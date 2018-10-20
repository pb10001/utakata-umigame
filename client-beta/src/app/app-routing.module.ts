import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LobbyComponent } from './lobby/lobby.component';
import { ConfigComponent } from './config/config.component';
import { MondaiComponent} from './mondai/mondai.component';
import { MondaiEditorComponent } from './mondai-editor/mondai-editor.component';
import { AnswerEditorComponent } from './answer-editor/answer-editor.component';

const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'mondai', component: ConfigComponent },
  { path: 'mondai/:id', component: MondaiComponent },
  { path: 'edit_mondai', component: MondaiEditorComponent },
  { path: 'edit_answer', component: AnswerEditorComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
