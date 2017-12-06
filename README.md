# utakata-umigame
Node.jsを用いたQ&A形式のチャットアプリです。
## 事前にインストールするもの
- redis(サーバー)  
Ubuntuなどの場合  
```
sudo apt-get install redis-server
```  
Windowsの場合  
[RedisをWindowsにインストールしてみる -Qiita](https://qiita.com/okoi/items/3bb5ae26ad559e4f39a0)
- node
- npm
  - express
  - socket.io
  - async
  - node_redis
```
npm install express
npm install socket.io
npm install async
npm install redis
```
## 使い方
- ZIPをダウンロードする場合  
Clone or Download→Download ZIP→ZIPを展開  
- Gitをインストール済みの場合  
```
git clone https://github.com/pb10001/utakata-umigame.git
```
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
- redis
### クライアントサイド
- bootstrap
- jQuery
- angular.js
