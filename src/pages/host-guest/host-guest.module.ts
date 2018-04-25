import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HostGuestPage } from './host-guest';

@NgModule({
  declarations: [
    HostGuestPage,
  ],
  imports: [
    IonicPageModule.forChild(HostGuestPage),
  ],
})
export class HostGuestPageModule {}
