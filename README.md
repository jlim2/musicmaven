# Music Maven
An application for sharing song requests with your friends! One person is the 
DJ and other members of the party are the guests. The DJ can add/delete songs and
refer to the list to play the songs that the guests want played.
The guests can add songs and vote up/down on that they have added.

Powered by Ionic to provide cross-platform mobile application that feels natural
on each user's device.

This is a project for COMP225: Software Development at Macalester College.

Old repository: https://github.com/ahelfins/Democratic-DJ

## Features
### All
* analog song input (song title, artist name)
* animations when voting

### Host
* make room with unique room code
* delete song from all people
* sorted song list by votes

### Guest
* enter room with the room code
* vote on songs

## Installation Guide
### Installing on Ionic View
As this app is yet to be released, you'll need to run it on the Ionic View app. You can download
Ionic View on your Android or Apple Phone by simply searching for it on the Google Play Store
or App Store respectively. Once downloaded, just navigate to the center tab and enter our App
ID "0b5aa138". Then the app should launch on its own! If you want to exit the app, you either
press the home button or shake your phone and select "Exit" from the pop-up menu.

### Installing Directly onto Android or Apple Device
Unfortunately our app isn't quite ready for this yet, but check back soon!

## Issues
* Negative song votes appear occasionally
* Multiple kickout alerts prompted for Guest exits and re-enters the same room
* Kickout alert prompted for Guest who exitted the room already
* Guest does not get kicked out when adding a song at the same time as Host ending the party

## For Developers
### System Context Diagram
![System Context Diagram](src/assets/imgs/Diagram1_SystemContext.jpg)

### Container Diagram
![Container Diagram](src/assets/imgs/Diagram2_Container.jpg)

