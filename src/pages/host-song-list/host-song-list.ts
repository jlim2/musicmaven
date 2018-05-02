import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController} from 'ionic-angular';
import { AddSongPage } from "../add-song/add-song";
import { FirebaseProvider } from "../../providers/firebase/firebase"
import { SessionDataProvider } from "../../providers/session-data/session-data";
import { HostGuestPage } from "../host-guest/host-guest";


/**
 * Displays the room-specific song list for the host. Allows deleting songs.
 */

@IonicPage()
@Component({
  selector: 'page-host-song-list',
  templateUrl: 'host-song-list.html',
})
export class HostSongListPage {
  addSongButton: any;
  public roomCode: string;
  songList: any;
  roomTitle: String;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public fBProvider: FirebaseProvider,
              private sDProvider: SessionDataProvider) {
    this.addSongButton = AddSongPage;
    this.roomCode = this.sDProvider.roomCode;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HostSongListPage');
    console.log('Current room: ' +this.roomCode);
    this.roomTitle = "Host: "+ this.roomCode;
    this.songList = this.fBProvider.getSortedSongList(this.roomCode).valueChanges();

  }

  /**
   * Takes an user to the AddSongPage of the specified room.
   */
  goToAddSongPage() {
    console.log("roomCode going to add song page:" + this.roomCode);
    this.navCtrl.push(AddSongPage, {roomCode: this.roomCode});
  }

  /**
   * Takes an user to the main page (host-guest) and deletes the room.
   */
  exitRoom() {
    console.log("exiting room " + this.roomCode);
    this.fBProvider.deleteRoom(this.roomCode);
    this.navCtrl.setRoot(HostGuestPage).then(() => {
      this.navCtrl.popToRoot();

    });
  }

  /**
   * Confirms the user wants to close the room.
   */
  exitConfirm() {
    let alert = this.alertCtrl.create({
      title: 'End Party',
      message: 'Are you sure you want to close the room?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Exit',
          handler: () => {
            console.log('Exit clicked');
            this.exitRoom();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Delays async functions. Gives it time to perform the animation before
   * the song is deleted.
   * @param {number} ms
   * @returns {Promise<any>}
   */
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  /**
   * Deletes a song from the list (and the Firebase).
   * @param song
   */
  async deleteSong(song) {
    await this.delay(300);
    this.fBProvider.deleteSong(song, this.roomCode);
  }

  /**
   * Returns the fbkey of a song for trackBy on the list.
   * @param index
   * @param song
   * @returns {string | any}
   */
  trackByFbKey(index, song) {
    return song.fbKey;
  }
}
