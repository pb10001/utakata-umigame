import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LobbyComponent } from './lobby/lobby.component';
import { ConfigComponent } from './config/config.component';
import { MondaiComponent} from './mondai/mondai.component';

const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'mondai', component: ConfigComponent },
  { path: 'mondai/:id', component: MondaiComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
