import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HostSongItemComponent } from './host-song-item';

@NgModule({
  declarations: [HostSongItemComponent],
  imports: [
    IonicModule
  ],
  providers: [],
  exports: [HostSongItemComponent]
})
export class HostSongItemComponentModule { }
