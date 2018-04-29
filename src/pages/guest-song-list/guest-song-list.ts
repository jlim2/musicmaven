import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController } from 'ionic-angular';
import { AddSongPage } from "../add-song/add-song";
import { FirebaseProvider } from "../../providers/firebase/firebase"
import { SessionDataProvider } from "../../providers/session-data/session-data";
import { HostGuestPage } from "../host-guest/host-guest";


/**
 * Displays the room-specific song list for Guest. Allows for voting on songs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guest-song-list',
  templateUrl: 'guest-song-list.html'})

export class GuestSongListPage {
  addSongButton: any;
  public roomId: string;
  title: String;
  songList: any;
  room: any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public fBProvider: FirebaseProvider,
              private sDProvider: SessionDataProvider) {
    this.addSongButton = AddSongPage;
    this.roomId = this.sDProvider.getRoomCode();
    this.room = this.fBProvider.getRoom(this.roomId).valueChanges();
    this.kickedoutConfirm(); // kick out the guest if the party has ended
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuestSongListPage');
    console.log('Current room: '+this.roomId);
    console.log('Host?: '+this.sDProvider.isHost());
    this.title = "Guest: "+this.roomId;
    this.songList = this.fBProvider.getSongList(this.roomId).valueChanges();
  }

  /**
   * Takes user to the add song page of the current room.
   */
  goToAddSongPage() {
    this.navCtrl.push(AddSongPage, {roomId: this.roomId});
  }

  /**
   * Displays an alert to guests when the room is closed.
   * Alert pops up AFTER directing the guest to the host-guest-page
   */
  kickedoutConfirm() {
    let activeRoom = this.navCtrl.getActive().name;
    console.log("activeRoom: ", activeRoom);
    if (activeRoom == "GuestPage"|| activeRoom == "GuestSongListPage" || activeRoom == "HostGuestPage") {
      this.room.subscribe((room) => {
        if (room == null) {
          let alert = this.alertCtrl.create({
            title: 'Party Ended',
            message: 'The host has ended the party. Hope you had a wonderful time!',
            buttons: [{
              text: 'OK',
              role: 'ok',
              handler: () => {
                console.log('OK clicked');
              }
            }]
          }).present().then(() => {
            console.log("alert presented");
            this.navCtrl.insert(0, HostGuestPage).then(() => {
              this.navCtrl.popToRoot();
            });
          });
        }
      });
    }
  }

  /**
   * Takes user to the main page.
   */
  exitRoom() {
    console.log("exiting room " + this.roomId);
    this.navCtrl.insert(0, HostGuestPage).then(() => {
      this.navCtrl.popToRoot();
    });
  }

  /**
   * Confirms the user wants to exit the room.
   */
  exitConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Exit Room',
      message: 'Are you sure you want to exit the room?',
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
   * Deletes a song from the list (and the Firebase)
   * @param song - Song object to be deleted
   */
  deleteSong(song) {
    this.fBProvider.deleteSong(song, this.roomId);
  }

  /**
   * Votes on a song.
   * @param song - Song object to be voted on
   * @param isUpVote - Boolean. True if an upvote, false if a downvote.
   */
  vote(song, isUpVote){
    let votes = this.sDProvider.getSongVotes(song);
    if (votes == 0) {
      if(isUpVote){
        this.sDProvider.updateSongVotes(song, 1);
      }
      else {
        this.sDProvider.updateSongVotes(song, -1);
      }
      this.fBProvider.updateVote(song, this.roomId, isUpVote);
    }
    else if (votes == 1) {
      if(!isUpVote){
        this.sDProvider.updateSongVotes(song, -1);
        this.fBProvider.switchVote(song, this.roomId, isUpVote);
      }
    }
    else {
      if(isUpVote){
        this.sDProvider.updateSongVotes(song, 1);
        this.fBProvider.switchVote(song, this.roomId, isUpVote);
      }
    }
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
