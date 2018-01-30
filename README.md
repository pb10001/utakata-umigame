# utakata-umigame
Node.jsを用いたQ&A形式のチャットアプリです。
## 事前にインストールするもの
- node
- npm
- redis
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
### サーバサイド
- node.js
- express
- socket.io
- async
- node-redis
### クライアントサイド
- browserify
- bootstrap
- jQuery
- angular.js

## ライセンス
このアプリケーションはGPL 3.0のもとで配布されています。
