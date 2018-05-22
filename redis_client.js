//connect to redis
//参考：https://qiita.com/5a3i/items/224ee1ea234d90d9dd7a
var redis = require('redis'),
  url = require('url');
if (process.env.REDISTOGO_URL) {
  var rtg = url.parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);

  client.auth(rtg.auth.split(':')[1]);
} else {
  var client = redis.createClient();
}
client.on('error', function(err) {
  console.log('Error ' + err);
});

module.exports = client;
