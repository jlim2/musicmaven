//import { Firebase } from '@ionic-native/firebase';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { HostGuestPage } from '../pages/host-guest/host-guest';
import 'web-animations-js/web-animations.min';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HostGuestPage;
  //items: FirebaseListObservable<any>;


  constructor(platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
