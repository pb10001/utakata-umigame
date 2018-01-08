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
- bootstrap
- jQuery
- angular.js

## ライセンス
このアプリケーションはGPL 3.0のもとで配布されています。
公開しているソースコードの使用、再頒布は以下の条件を満たしている限り自由に行えます。
- このgithubリポジトリへの引用を明記する。
- 変更箇所がある場合は、その旨を明記する。
- ソースコードを公開する場合、GPL 3.0またはGPL 3.0より限定されたライセンスを付与する。  
詳細はGPL 3.0の原文をご参照ください。  
不明点やご指摘等がございましたらお気軽にご連絡ください。
