import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LobbyComponent } from './lobby/lobby.component';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  { path: 'mondai', component: ConfigComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
