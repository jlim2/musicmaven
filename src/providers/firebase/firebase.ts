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
   * Generates a room with the generated roomId on the Firebase.
   * @param roomId  a string of numbers and alphabets unique to each room
   */
  genRoom(roomId) {
    this.afDB.database.ref('/').child('rooms').child(roomId).set({id: roomId});
  }

  /**
   * Getter for the list of rooms from the Firebase
   * @returns {AngularFireList<T>}
   */
  getRoomDir() {
    return this.afDB.list('/rooms/');
  }

  /**
   * Getter for the Firebase reference of the given room
   * @param roomCode
   * @returns {firebase.database.Reference}
   */
  getRoomRef(roomCode) {
    return this.afDB.database.ref('/rooms/').child(roomCode);
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
    // return this.afDB.list<Song []>('/rooms/'+roomCode+'/songs', ref => {
    //   return ref.orderByChild('upVotes')
    // })
    return this.afDB.list<Song []>('/rooms/'+roomCode+'/songs');
  }

  /**
   * Generates room with the roomCode on Firebase
   * @param roomCode
   */
  pushRoom(roomCode) {
    this.afDB.list('/rooms/').push(roomCode);
  }

  /**
   * Push the song that the user provided
   * @param song - a Song object
   * @param roomId - roomId of the room that the host or the guest is in
   */
  pushSong(song, roomId){
    let promise = this.afDB.list("rooms/"+roomId+"/songs").push(song);
    // this.afDB.database.ref("rooms/"+roomId+"/songs"+song.fBKey).orderByChild('upVotes');
    // console.log("trying to order by child");
    song.fbKey = promise.key;
    this.afDB.database.ref('/').child('rooms').child(roomId).child('songs').child(promise.key).update({fbKey: promise.key});
    console.log("Attempted to push: " + song.title);
    return promise;
  }

  /**
   * Updates the up or down votes of a song in firebase
   * @param song - a Song object
   * @param roomId - ID of current room
   * @param isUpVote - boolean, true if the vote is an upvote, false if down vote
   */
  updateVote(song, roomId, isUpVote){
    const songRef = this.afDB.database.ref('/').child('rooms').child(roomId).child('songs').child(song.fbKey);
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
    // this.afDB.database.ref("rooms/"+roomId+"/songs"+song.fBKey).orderByChild('upVotes');
    // console.log("trying to order by child");
  }

  /**
   * Switches the vote of a song that the user already has voted on.
   * @param song - a Song object
   * @param roomId - ID of current room
   * @param switchToUpVote - boolean, true if switching to an upvote, false if switching to a downvote
   */
  switchVote(song, roomId, switchToUpVote){
    const songRef = this.afDB.database.ref('/').child('rooms').child(roomId).child('songs').child(song.fbKey);
    // songRef.update({downVotes:song.downVotes});
    // songRef.update({upVotes:song.upVotes});
    if(switchToUpVote){
      // songRef.update({downVotes:--song.downVotes});
      // songRef.update({upVotes:++song.upVotes});
      songRef.transaction(function(currentSong){
        currentSong.downVotes-=1;
        currentSong.upVotes+=1;
        return currentSong;
      });
    }
    else{
      // songRef.update({upVotes:--song.upVotes});
      // songRef.update({downVotes:++song.downVotes});
      songRef.transaction(function(currentSong){
        currentSong.downVotes+=1;
        currentSong.upVotes-=1;
        return currentSong;
      });
    }
  }

  /**
   * Deletes the room when the party is over.
   * @param roomId - ID of the room to be deleted
   */
  deleteRoom(roomId) {
    const roomRef = this.afDB.database.ref('/').child('rooms').child(roomId);
    console.log("roomId: "+ roomId + " roomRef on deleteRoom: "+ roomRef);
    roomRef.remove();
  }

  /**
   * Deletes the specified song from the unique room.
   * @param song  - Song object to be deleted
   * @param roomId - ID of room the song to be deleted from
   */
  deleteSong(song, roomId) {
    const songRef = this.afDB.database.ref('/').child('rooms').child(roomId).child('songs').child(song.fbKey);
    songRef.remove();
  }

  /**
   * fetches a list of roomCodes (roomIds) that would be used to verify if the
   * user is trying to enter the correct room
   * @returns {any[]} - a list of room ids
   */
  getRoomIdList() {
    let i = 0;
    let idList = [];
    this.afDB.list("/rooms").valueChanges()
      .subscribe(list =>{
        list.forEach(item => {
          idList[i] = item['id'];
          i++;
        });
      });
    return idList;
  }

}
