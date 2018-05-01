import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Song } from '../../interfaces/song';

/**
 * Provider that handles all interactions with Firebase.
 *
 * See https://angular.io/guide/dependency-injection for more info on providers
 * and Angular DI.
 */


@Injectable()
export class FirebaseProvider {
  constructor(public afDB: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }

  /**
   * Generates a room with the generated roomCode on the Firebase.
   * @param roomCode  a string of numbers and alphabets unique to each room
   */
  genRoom(roomCode) {
    this.afDB.database.ref('/').child('rooms').child(roomCode).set({roomCode: roomCode});
  }

  /**
   * Getter for the Room object of the given room from Firebase
   * @param roomCode
   * @returns {AngularFireObject<any>}
   */
  getRoom(roomCode) {
    return this.afDB.object('/rooms/'+roomCode);
  }

  /**
   * Getter for the list of songs from the Firebase
   * @param roomCode
   * @returns {AngularFireList<Song[]>}
   */
  getSongList(roomCode) {
    return this.afDB.list<Song []>('/rooms/'+roomCode+'/songs');
  }

  getSortedSongList(roomCode) {
    return this.afDB.list<Song []>('/rooms/'+roomCode+'/songs', ref => {
      return ref.orderByChild('upVotes')
    })
  }

  /**
   * Push the song that the user provided
   * @param song - a Song object
   * @param roomCode - roomCode of the room that the host or the guest is in
   */
  pushSong(song, roomCode){
    let promise = this.afDB.list("rooms/"+roomCode+"/songs").push(song);
    song.fbKey = promise.key;
    this.afDB.database.ref('/').child('rooms').child(roomCode).child('songs').child(promise.key).update({fbKey: promise.key});
    console.log("Attempted to push: " + song.title);
    return promise;
  }

  /**
   * Updates the up or down votes of a song in firebase
   * @param song - a Song object
   * @param roomCode - ID of current room
   * @param isUpVote - boolean, true if the vote is an upvote, false if down vote
   */
  updateVote(song, roomCode, isUpVote){
    const songRef = this.afDB.database.ref('/').child('rooms').child(roomCode).child('songs').child(song.fbKey);
    if(isUpVote) {
      songRef.child('upVotes').transaction(function(currentUpVotes){
        return currentUpVotes + 1;
      });
    }
    else{
      songRef.child('downVotes').transaction(function(currentDownVotes){
        return currentDownVotes + 1;
      });
    }
  }

  /**
   * Switches the vote of a song that the user already has voted on.
   * @param song - a Song object
   * @param roomCode - ID of current room
   * @param switchToUpVote - boolean, true if switching to an upvote, false if switching to a downvote
   */
  switchVote(song, roomCode, switchToUpVote){
    const songRef = this.afDB.database.ref('/').child('rooms').child(roomCode).child('songs').child(song.fbKey);
    if(switchToUpVote){
      songRef.transaction(function(currentSong){
        currentSong.downVotes-=1;
        currentSong.upVotes+=1;
        return currentSong;
      });
    }
    else{
      songRef.transaction(function(currentSong){
        currentSong.downVotes+=1;
        currentSong.upVotes-=1;
        return currentSong;
      });
    }
  }

  /**
   * Deletes the room when the party is over.
   * @param roomCode - ID of the room to be deleted
   */
  deleteRoom(roomCode) {
    const roomRef = this.afDB.database.ref('/').child('rooms').child(roomCode);
    console.log("roomCode: "+ roomCode + " roomRef on deleteRoom: "+ roomRef);
    roomRef.remove();
  }

  /**
   * Deletes the specified song from the unique room.
   * @param song  - Song object to be deleted
   * @param roomCode - ID of room the song to be deleted from
   */
  deleteSong(song, roomCode) {
    const songRef = this.afDB.database.ref('/').child('rooms').child(roomCode).child('songs').child(song.fbKey);
    songRef.remove();
  }

  /**
   * fetches a list of roomCodes that would be used to verify if the
   * user is trying to enter the correct room
   * @returns {any[]} - a list of room codes
   */
  getRoomCodeList() {
    let i = 0;
    let codeList = [];
    this.afDB.list("/rooms").valueChanges()
      .subscribe(list =>{
        list.forEach(room => {
          codeList[i] = room['roomCode'];
          i++;
        });
      });
    return codeList;
  }

}
