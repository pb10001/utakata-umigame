import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LobbyChatComponent } from './lobby-chat/lobby-chat.component';
import { AppRoutingModule } from './app-routing.module';
import { LobbyComponent } from './lobby/lobby.component';
import { MondaiComponent } from './mondai/mondai.component';
import { ConfigComponent } from './config/config.component';
import { EditorComponent } from './editor/editor.component';
import { MondaiEditorComponent } from './mondai-editor/mondai-editor.component';
import { AnswerEditorComponent } from './answer-editor/answer-editor.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { LobbyEditorComponent } from './lobby-editor/lobby-editor.component';
@NgModule({
  declarations: [
    AppComponent,
    LobbyChatComponent,
    LobbyComponent,
    MondaiComponent,
    ConfigComponent,
    EditorComponent,
    MondaiEditorComponent,
    AnswerEditorComponent,
    ChatBoxComponent,
    LobbyEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
