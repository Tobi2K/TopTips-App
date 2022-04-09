<h1 align="center">
  <br>
  <a href="http://app.kalmbach.dev"><img src="./public/assets/icon/rounded_icon.png" alt="Top Tips" width="200"></a>
  <br>
  Top Tips
  <br>
</h1>
<p align="center">
  <a href='https://play.google.com/store/apps/details?id=app.kalmbach.dev&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' width=150/></a>
  <!-- Google Play and the Google Play logo are trademarks of Google LLC. -->
</p>

<h4 align="center">A lightweight app for a handball guessing game.</h4>
<br>
<p align="center">
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/Tobi2K/TopTips-App?style=flat-square">
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/Tobi2K/TopTips-App/Deploy%20to%20Firebase%20Hosting%20on%20merge?style=flat-square">
  <img alt="GitHub" src="https://img.shields.io/github/license/Tobi2K/TopTips-App?style=flat-square">
  <img alt="GitHub package.json dependency version (prod)" src="https://img.shields.io/github/package-json/dependency-version/Tobi2K/TopTips-App/ionic?style=flat-square">
  <img alt="Website" src="https://img.shields.io/website?down_message=offline&style=flat-square&up_message=online&url=https%3A%2F%2Fapp.kalmbach.dev">
</p>
<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/Tobi2K/TopTips-App?style=flat-square">
  <img alt="CodeFactor Grade" src="https://img.shields.io/codefactor/grade/github/Tobi2K/TopTips-App?style=flat-square">
  <img alt="Libraries.io dependency status for GitHub repo" src="https://img.shields.io/librariesio/github/Tobi2K/TopTips-App?style=flat-square">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/Tobi2K/TopTips-App?style=flat-square">
  <img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/Tobi2K/TopTips-App?style=flat-square">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/Tobi2K/TopTips-App?style=flat-square">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Tobi2K/TopTips-App?style=flat-square">
</p>

<hr>

<p align="center">
  <img src="./public/assets/screenshots/login_light.jpg" width=20%>
  <img src="./public/assets/screenshots/play_light.jpg" width=20%>
  <img src="./public/assets/screenshots/create_group.jpg" width=20%>
  <img src="./public/assets/screenshots/settings.jpg" width=20%>
</p>

## What?
Top Tips is a lightweight guessing game for handball leagues. You can choose from more than 130 leagues in 25 countries as well as international leagues. 

You can create groups for different leagues and seasons and play with your friends.

## How?
Top Tips is built with [ionic](https://ionicframework.com/) and [vue](https://vuejs.org/). Ionic adds native android support and PWA support is provided by vue.

## Installation
Clone project and install dependencies
```bash
git clone https://github.com/Tobi2K/TopTips-App.git

cd TopTips-App && npm i
```

Install `@ionic/cli`
```bash
npm install -g @ionic/cli
```

Build and run project
```bash
ionic build && ionic serve
```

Build your own app bundle (AndroidStudio required)
```bash 
ionic build
ionic cap copy
ionic cap sync
ionic cap open android # you might need to configure/export your AndroidStudio path
```
A guide for generating an app bundle or an apk can be found [here](https://developer.android.com/studio/publish/app-signing#generate-key)

## Usage
Feel free to try out the app yourself. You can find it on [Google Play](https://play.google.com/store/apps/details?id=app.kalmbach.dev) or use the [web version](https://app.kalmbach.dev). 

Opening the web version in a compatible mobile browser will show a prompt to install a PWA version to your device.

## General information

Tobias Kalmbach – t.kalmbach35@gmail.com - 
[My GitHub](https://github.com/Tobi2K/)

Distributed under the TBD license. See ``LICENSE`` for more information.
