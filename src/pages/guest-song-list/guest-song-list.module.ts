import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuestSongListPage } from './guest-song-list';
import { SongItemComponentModule } from '../../components/song-item/song-item.module'

@NgModule({
  declarations: [
    GuestSongListPage
  ],
  imports: [
    IonicPageModule.forChild(GuestSongListPage),
    SongItemComponentModule
  ],
})
export class GuestSongListPageModule {}
