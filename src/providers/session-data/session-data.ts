import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseProvider } from '../firebase/firebase';

/**
 * Provider that handles current user and session data.
 *
 * See https://angular.io/guide/dependency-injection for more info on providers
 * and Angular DI.
*/
@Injectable()
export class SessionDataProvider {
  roomCode: string;
  hostBool: boolean;
  songVotes : Object;

  constructor(public http: HttpClient, public fBProvider: FirebaseProvider) {
    console.log('Hello SessionDataProvider Provider');
    this.songVotes = {};
  }

  /**
   * Updates the vote on a song from the current session user.
   * @param song - a Song object
   * @param roomId - ID of current room
   * @param isUpVote - 1 for an upvote, 0 for no vote, -1 for downvote
   */
  updateSongVotes(song, isUpVote){
    let titleAndArtistString = song.title + song.artist;
    this.songVotes[titleAndArtistString] = isUpVote;
  }

  /**
   * Gets the current session user's vote on a song. If the song hasn't been voted on, gives it 0 votes.
   * @param song - a Song object
   * @returns {number} - current session user's votes
   */
  getSongVotes(song){
    let titleAndArtistString = song.title + song.artist;
    console.log("getSongVotes song.title+song.artist: ", titleAndArtistString)
    if (!(titleAndArtistString in this.songVotes)){
      this.updateSongVotes(song, 0);
    }
    return this.songVotes[titleAndArtistString];
  }

  /**
   * Is the current user a host or a guest?
   * @returns {boolean} - true if host, false if guest
   */
  isHost() {
    return this.hostBool;
  }

  /**
   * Sets the current user as the host
   * @param hostBoolIn
   */
  setHost(hostBoolIn) {
    this.hostBool = hostBoolIn;
  }

  /**
   * Getter for the current session's room code
   * @returns {string}
   */
  getRoomCode() {
    return this.roomCode;
  }

  /**
   * Setter for the current session's room code
   * @param roomCodeIn
   */
  setRoomCode(roomCodeIn) {
    this.roomCode = roomCodeIn;
  }
}
