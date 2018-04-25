import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, group, query, stagger, keyframes} from '@angular/animations';
import { Song } from "../../interfaces/song";
import 'web-animations-js/web-animations.min';


/**
 * Generated class for the HostSongItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'host-song-item',
  templateUrl: 'host-song-item.html',
  animations: [
    trigger('slideOut', [
      state('in', style({
        'opacity': '1', 'visibility': 'visible'
      })),
      state('outLeft', style({
        'opacity': '0', 'visibility': 'hidden'
      })),
      state('outRight', style({
        'opacity': '0', 'visibility': 'hidden'
      })),
      transition('in => outLeft', [group([
          animate('0.25s ease-in-out', style({
            'visibility': 'hidden'
          })),
          animate('0.25s ease-in-out', style({
            'opacity': '0'
          })),
          animate('0.5s ease-in-out', style({
            'transform': 'translateX(-100%)'
          }))
        ])]),
      transition('in => outRight', [group([
        animate('0.25s ease-in-out', style({
          'visibility': 'hidden'
        })),
        animate('0.25s ease-in-out', style({
          'opacity': '0'
        })),
        animate('05s ease-in-out', style({
          'transform': 'translateX(10000%)'
        }))
      ])])
    ])
  ]
})


export class HostSongItemComponent {

  @Input() song: Song;
  visibleState = 'in';

  constructor() {
  }

  ngOnInit() {}

  /**
   *Toggles the delete animation
   * @param dir - the direction of the swipe. -1 for left, 1 for right
   */
  toggleDeleteAnim(dir) {
    if (dir == -1) {
      this.visibleState = (this.visibleState == 'in') ? 'outLeft' : 'in';
    } else if (dir == 1) {
      this.visibleState = (this.visibleState == 'in') ? 'outRight' : 'in';
    }
  }

}
