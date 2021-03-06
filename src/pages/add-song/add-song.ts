import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { GuestSongListPage } from '../guest-song-list/guest-song-list';
import { HostSongListPage } from '../host-song-list/host-song-list';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { Song } from "../../interfaces/song";
import { SessionDataProvider } from "../../providers/session-data/session-data";
import { HostGuestPage } from "../host-guest/host-guest";


/**
 * A host or guest can add a song to the song list of the current room.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-song',
  templateUrl: 'add-song.html',
})
export class AddSongPage {
  GuestSongListButton : any;
  HostSongListButton : any;
  roomCode : string;
  title: string;
  room: any;
  MAX_SONG_LENGTH: number = 50;
  MAX_ARTIST_LENGTH: number = 50;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public fBProvider: FirebaseProvider,
              private sDProvider: SessionDataProvider) {
    this.GuestSongListButton = GuestSongListPage;
    this.HostSongListButton = HostSongListPage;
    this.roomCode = this.sDProvider.roomCode;
    this.room = this.fBProvider.getRoom(this.roomCode).valueChanges();
    this.kickedoutConfirm(); // kick out the guest if the party has ended
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSongPage');
    console.log('Add Song Room: ' + this.roomCode); // DEBUG
  }

  /**
   * Checks if the input song and artist are valid inputs.
   * @param {string} song
   * @param {string} artist
   * @returns {boolean}
   */
  isValidInput(song:string, artist:string) {
    var cleanSong;
    var cleanArtist;
    if(this.inputIsNotNull(song, artist)) {
      cleanSong = this.cleanPuncSpaceFromInputItem(song);
      cleanArtist = this.cleanPuncSpaceFromInputItem(artist);
    }
    else {
      return false;
    }
    if(this.inputIsNotNull(cleanSong, cleanArtist)) {
      if(cleanSong == null || cleanSong === "") {
        song = "1";
      }
      if(cleanArtist == null || cleanArtist === "") {
        artist = "1";
      }
      console.log("Cleaned inputs are not null");
      return this.inputIsNotTooLong(song, artist);
    } else {
      return false;
    }
  }

  /**
   * Checks that the input song and artist are not both null.
   * @param {string} song
   * @param {string} artist
   * @returns {boolean}
   */
  inputIsNotNull(song: string, artist: string) {
    var cleanSong = this.cleanPuncSpaceFromInputItem(song);
    var cleanArtist = this.cleanPuncSpaceFromInputItem(artist);
    if(!((cleanSong === "" || cleanSong == null) && (cleanArtist === "" || cleanArtist == null))) {
      console.log("Is not null: " + "+++"+song+"+++" + " - " + "+++"+artist+"+++");
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Checks that the input song and artist are not too long.
   * @param {string} song
   * @param {string} artist
   * @returns {boolean}
   */
  inputIsNotTooLong(song: string, artist: string) {
    //At the moment too long has been determined to be >50 characters
    if(song.length < this.MAX_SONG_LENGTH && artist.length < this.MAX_ARTIST_LENGTH) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Cleans the input  string of spaces and punctuation.
   * @param {string} input - the input string
   * @returns {string}
   */
  cleanPuncSpaceFromInputItem(input: string) {
    if(input != null && !(input === "")) {
      var noSpaceInput = input.replace(/\s/g, '');
      var cleanInput = noSpaceInput.replace(/[^0-9a-z]/gi, '');
      console.log(cleanInput);
      return cleanInput;
    }
    else {
      return "";
    }
  }

  /**
   * Cleans the input artist string. Returns "Unknown" if no artist input.
   * @param {string} artist - the input artist
   * @returns {string}
   */
  replaceEmptyArtist(artist:string) {
    var cleanArtist = this.cleanPuncSpaceFromInputItem(artist);
    if(cleanArtist == null || cleanArtist == "") {
      artist = "Unknown";
    }
    return artist;
  }

  /**
   * Cleans the input song title string. Returns "Any Song" if no song title input.
   * @param {string} songTitle - the input song title
   * @returns {string}
   */
  replaceEmptySong(songTitle: string) {
    var cleanSong = this.cleanPuncSpaceFromInputItem(songTitle);
    if(cleanSong == null || cleanSong == "") {
      songTitle = "Any Song";
    }
    return songTitle;
  }

  /**
   * Displays an alert if the input is not valid.
   */
  badSongAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Input',
      message: 'It looks like your song choice was either too long or wasn\'t a valid input. Please try again!',
      buttons: ['Okay']
    });
    alert.present();
  }


  /**
   * Adds the song the user input to the Firebase under the specific room
   * where the user is located.
   * @param songInput - user input of the song name
   * @param artistInput - user input of the artist name
   */
  addSongToFB(songInput, artistInput) {
    if(this.isValidInput(songInput, artistInput)) {
      console.log("songName: " + songInput + ", and roomCode: " +this.roomCode); // DEBUG
      let song: Song = {title: this.replaceEmptySong(songInput), artist: this.replaceEmptyArtist(artistInput), upVotes: 0, downVotes: 0}; // converts the song to a Song object
      this.fBProvider.pushSong(song, this.roomCode); // pushes the song to the Firebase
      console.log("fbkey "+ song.fbKey);
    } else {
      this.badSongAlert();
    }
  }

  /**
   * Displays an alert to guests when the room is closed.
   * Alert pops up AFTER directing the guest to the host-guest-page
   * Copied from guest-song-lis.ts
   */
  kickedoutConfirm() {
    if (this.navCtrl.getActive().name == "AddSongPage") {
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
           this.navCtrl.setRoot(HostGuestPage).then(() => {
              this.navCtrl.popToRoot();
            });
          });
        }
      });
    }

  }

  /**
   * If host, go to host song list page, otherwise GuestSongListPage
   */
  goToSongListPage(){
    console.log("Trying to go to Song List page with "+this.roomCode);
    if (this.sDProvider.isHost == true) {
      this.navCtrl.setRoot(HostSongListPage, {roomId: this.roomCode}).then(() => {
        this.navCtrl.popToRoot();
      });
    }
    else {
      this.navCtrl.setRoot(GuestSongListPage, {roomId: this.roomCode}).then(() => {
        this.navCtrl.popToRoot();
      });
    }
  }
}
