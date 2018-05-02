import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortByVotesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sortByVotes',
  pure: false,
})
export class SortByVotesPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(values: any, ...args) {
    if(values) {
      return values.reverse();
    }
    else {
      console.log("No Values to reverse!")
    }
  }
}
