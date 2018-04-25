import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SongItemComponent } from './song-item/song-item';
import { HostSongItemComponent } from './host-song-item/host-song-item';
@NgModule({
	declarations: [SongItemComponent,
    HostSongItemComponent],
	imports: [IonicModule],
	exports: [SongItemComponent,
    HostSongItemComponent]
})
export class ComponentsModule {}
