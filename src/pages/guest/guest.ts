import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { GuestSongListPage } from '../guest-song-list/guest-song-list';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { SessionDataProvider } from "../../providers/session-data/session-data";
import { FirebaseProvider } from "../../providers/firebase/firebase";
/**
 * Generated class for the GuestPage page.
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
  idList: Array<String>;

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public alertCtrl: AlertController,
    private sDProvider: SessionDataProvider,
    public fBProvider: FirebaseProvider) {

    this.EnterRoomButton = GuestSongListPage;
    this.roomList = this.afDB.list('/rooms');
    this.room = this.roomList.valueChanges();
    this.idList = new Array<String>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuestPage');
    this.idList = this.fBProvider.getRoomIdList();
  }

  /**
   * Creates a list of available room IDs
   */
  makeIdList() {
    let i = 0;
    this.afDB.list("/rooms").valueChanges()
      .subscribe(list =>{
        list.forEach(item => {
          this.idList[i] = item['id'];
          i++;
        });
      });
    console.log(this.idList);
  }

  /**
   * Checks if the user input of room code is one of the room codes in the Firebase.
   * @param roomInput - User input room code
   * @param idList - list of room codes
   */
  isCorrectRoomInput(roomInput: string, idList: String[]) {
    let lowerRoomInput = roomInput.toLowerCase(); // Make the input case-insensitive
    // console.log("Inside START isCorrectRoomInput(" + lowerRoomInput +", " + idList +")"); //DEBUG
    console.log("roomInput", lowerRoomInput);
    let found = idList.indexOf(lowerRoomInput);
    console.log("found", found);

    if (found >= 0) {     //if roomCode matches a room, push to room, otherwise show an alert
      this.sDProvider.setRoomCode(lowerRoomInput);
      this.sDProvider.setHost(false);
      //Set GuestSongPage as root https://stackoverflow.com/questions/37296999/ionic-2-disabling-back-button-for-a-specific-view
      this.navCtrl.insert(0, GuestSongListPage, {roomId: idList[found]}).then(() => {
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
    // console.log("Inside END isCorrectRoomInput()");  //DEBUG

  }

}
