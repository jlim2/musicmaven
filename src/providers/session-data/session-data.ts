import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Provider that handles room and song data for current user.
*/
@Injectable()
export class SessionDataProvider {
  public roomCode: string;
  isHost: boolean;
  songVotes : Object;

  constructor(public http: HttpClient) {
    console.log('Hello SessionDataProvider Provider');
    this.songVotes = {};
  }

  /**
   * Updates the vote on a song from the current session user.
   * @param song - a Song object
   * @param isUpVote - 1 for an upvote, 0 for no vote, -1 for downvote
   */
  updateSongVotes(song, isUpVote){
    this.songVotes[song.fbKey] = isUpVote;
  }

  /**
   * Gets the current session user's vote on a song. If the song hasn't been voted on, gives it 0 votes.
   * @param song - a Song object
   * @returns {number} - current session user's votes
   */
  getSongVotes(song) {
    if (!(song.fbKey in this.songVotes)) {
      this.updateSongVotes(song, 0);
    }
    return this.songVotes[song.fbKey];
  }
}
