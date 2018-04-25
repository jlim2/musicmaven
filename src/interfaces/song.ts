/**
 * Song object
 * Created by JJ on 3/24/18.
 */
export interface Song {
  title: any;
  album?: any; //'?' for optional
  artist?: any;
  upVotes: number;
  downVotes: number;
  fbKey?: any;
}
