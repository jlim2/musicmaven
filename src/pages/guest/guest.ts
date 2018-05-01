import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { GuestSongListPage } from '../guest-song-list/guest-song-list';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
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
  roomCode: string = "";
  roomList: AngularFireList<any>;
  room: Observable<any[]>;
  roomCodeList: Array<String>;

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public alertCtrl: AlertController,
    private sDProvider: SessionDataProvider,
    public fBProvider: FirebaseProvider) {
    this.EnterRoomButton = GuestSongListPage;
    this.roomList = this.afDB.list('/rooms');
    this.room = this.roomList.valueChanges();
    this.roomCodeList = new Array<String>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuestPage');
    this.roomCodeList = this.fBProvider.getRoomCodeList();
  }

  /**
   * Creates a list of available room codes
   */
  makeIdList() {
    let i = 0;
    this.afDB.list("/rooms").valueChanges()
      .subscribe(roomList =>{
        roomList.forEach(room => {
          this.roomCodeList[i] = room['roomCode'];
          i++;
        });
      });
    console.log(this.roomCodeList);
  }

  /**
   * Checks if the user input of room code is one of the room codes in the Firebase.
   * @param roomInput - User input room code
   * @param roomCodeList - list of room codes
   */
  isCorrectRoomInput(roomInput: string, roomCodeList: String[]) {
    let cleanedRoomInput = roomInput.toLowerCase(); // Make the input case-insensitive
    console.log("roomInput", cleanedRoomInput);
    let found = roomCodeList.indexOf(cleanedRoomInput);
    console.log("found", found);

    if (found >= 0) {     //if roomCode matches a room, push to room, otherwise show an alert
      this.sDProvider.roomCode = cleanedRoomInput;
      this.sDProvider.setHost(false);
      //Set GuestSongPage as root https://stackoverflow.com/questions/37296999/ionic-2-disabling-back-button-for-a-specific-view
      this.navCtrl.insert(0, GuestSongListPage, {roomCode: roomCodeList[found]}).then(() => {
        this.navCtrl.popToRoot();
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Room not found!',
        message: 'The room code provided did not match any current rooms.',
        buttons: ["OK"]
      });
      alert.present();
    }

  }

}
