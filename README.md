# utakata-umigame
[![wercker status](https://app.wercker.com/status/5af6aa54224f279105a935d2e00cc359/s/master "wercker status")](https://app.wercker.com/project/byKey/5af6aa54224f279105a935d2e00cc359)
![Github All Releases](https://img.shields.io/github/downloads/atom/atom/total.svg)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
## 概要
Node.jsを用いたQ&A形式のチャットアプリです。
## 事前にインストールするもの
以下のアプリケーションは必須です。
- [node/npm](https://nodejs.org/en/)
- [redis](https://github.com/MicrosoftArchive/redis/releases)

以下のアプリケーションはあると便利です。
- [Git](https://git-scm.com/downloads)
## 使い方
- ZIPをダウンロードする場合  
Clone or Download→Download ZIP→ZIPを展開  
- Gitをインストール済みの場合  
```
git clone https://github.com/pb10001/utakata-umigame.git
```
- ライブラリをインストールする
```
npm install
```
- redisサーバーを起動する  
redisのインストール方法および起動方法は、検索するとたくさんヒットします。  
例えばWindowsの場合は[こちら](https://weblabo.oscasierra.net/redis-windows-install/)など
- ローカルサーバーをスタートする
```
node server.js
#localhost:5000にアクセス
```
## 使用したフォント
[M+](https://mplus-fonts.osdn.jp/)  
[こころ明朝体](http://typingart.net/?p=46)  
[Noto Sans Japanese](https://www.google.com/get/noto/)  
[はんなり明朝](http://typingart.net/?p=44)  
[さわらび明朝](http://mshio.b.osdn.me/)  

[Google Fonts + 日本語早期アクセス](https://googlefonts.github.io/japanese/)
## 使用したライブラリ・フレームワーク
### サーバサイドJS
- Node.js
- Express
- Socket.io
- Async
- Node-Redis
### クライアントサイドJS
- Browserify
- Bootstrap
- jQuery
- AngularJS
- Uglify-es
### css
- Animate.css

## ライセンス
このアプリケーションはGPL 3.0のもとで配布されています。
