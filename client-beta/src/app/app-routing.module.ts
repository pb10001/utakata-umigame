import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LobbyChatComponent } from './lobby-chat/lobby-chat.component';
import { ConfigComponent } from './config/config.component';
import { MondaiComponent} from './mondai/mondai.component';
import { MondaiEditorComponent } from './mondai-editor/mondai-editor.component';
import { AnswerEditorComponent } from './answer-editor/answer-editor.component';
import { LobbyEditorComponent } from './lobby-editor/lobby-editor.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LinkComponent } from './link/link.component';

const routes: Routes = [
  { path: '', component: LobbyChatComponent },
  { path: 'lobby', component: LobbyChatComponent },
  { path: 'mondai', component: ConfigComponent },
  { path: 'mondai/:id', component: MondaiComponent },
  { path: 'edit_mondai', component: MondaiEditorComponent },
  { path: 'edit_answer', component: AnswerEditorComponent },
  { path: 'lobby/edit', component: LobbyEditorComponent },
  { path: 'privacy_policy', component: PrivacyPolicyComponent },
  { path: 'link', component: LinkComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
