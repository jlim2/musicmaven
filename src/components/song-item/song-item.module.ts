import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SongItemComponent } from './song-item';

@NgModule({
  declarations: [SongItemComponent],
  imports: [
    IonicModule
  ],
  providers: [],
  exports: [SongItemComponent]
})
export class SongItemComponentModule { }
