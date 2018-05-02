import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { GuestSongListPage } from '../guest-song-list/guest-song-list';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { SessionDataProvider } from "../../providers/session-data/session-data";
import { FirebaseProvider } from "../../providers/firebase/firebase";
/**
 * Guests input the room code and enter the room.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guest',
  templateUrl: 'guest.html',
})
export class GuestPage {
  EnterRoomButton: any;
  roomCodeList: Array<string>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private sDProvider: SessionDataProvider,
              public fBProvider: FirebaseProvider) {
    this.EnterRoomButton = GuestSongListPage;
    this.roomCodeList = new Array<string>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuestPage');
    this.roomCodeList = this.fBProvider.getRoomCodeList();
  }

  /**
   * Checks if the user input of room code is one of the room codes in the Firebase.
   * @param roomInput - User input room code
   */
  isCorrectRoomInput(roomInput: string) {
    let cleanedRoomInput = roomInput.toLowerCase(); // Make the input case-insensitive
    console.log("roomInput", cleanedRoomInput);
    let found = this.roomCodeList.indexOf(cleanedRoomInput);
    console.log("roomFoundInd", found);

    //if roomCode matches a room, push to room, otherwise show an alert
    if (found >= 0) {
      this.sDProvider.roomCode = cleanedRoomInput;
      this.sDProvider.isHost = false;

      //Set GuestSongPage as root https://stackoverflow.com/questions/37296999/ionic-2-disabling-back-button-for-a-specific-view
      this.navCtrl.setRoot(GuestSongListPage, {roomCode: this.roomCodeList[found]}).then(() => {
        this.navCtrl.popToRoot();
      });
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Room not roomFoundInd!',
        message: 'The room code provided did not match any current rooms.',
        buttons: ["OK"]
      });
      alert.present();
    }

  }

}
