import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HostSongListPage } from './host-song-list';
import { HostSongItemComponentModule } from '../../components/host-song-item/host-song-item.module'


@NgModule({
  declarations: [
    HostSongListPage,
  ],
  imports: [
    IonicPageModule.forChild(HostSongListPage),
    HostSongItemComponentModule
  ],
})
export class HostSongListPageModule {}
