var st = require('st');
var http = require('http');

http.createServer(
  st(process.cwd())
).listen(1337);

var os = require('os');
var ifaces = os.networkInterfaces();

var myip = '';

for(var key in ifaces){
  var iface = ifaces[key];
  iface.forEach(function(details){
    // console.log(details);
    if(details.family === 'IPv4' && !details.internal){
      myip = details.address;
    }
  });
}

var rest = require('rest');
var mime = require('rest/interceptor/mime');

var parser = require('xml2json');

var WebSocket = require('ws');

var url = require('url');

var SSDP = require('node-ssdp');
var client = new SSDP();

// client.on('notify', function () {
//     console.log('Got a notification.');
// });

client.on('response', function (msg, rinfo) {
  var data = msg.toString('utf-8');
  var out = {};
  data.split(/\r\n|\n|\r/).forEach(function(line, idx){
    if(idx === 0){
      // console.log('STATUS', line);
      return;
    }
    var a = line.split(/:/);
    var key = a.shift();
    var val = a.join(':');

    if(key && val){
      out[key] = val.trim();
    }
  });

  // console.log(out);

  rest({
    path: out.LOCATION,
    headers: {
      'Host': url.parse(out.LOCATION).host
    }
  }).then(function(response){
    // console.log(response);

    var json = parser.toJson(response.entity, {
      object: true
    });

    // if(json.root.device.friendlyName !== 'phated-chromecast'){
    //   return;
    // }

    console.log(json);

    var applicationUrl = response.headers['Application-Url'];
    var applicationResourceUrl = applicationUrl + 'ChromeCast';

    rest.chain(mime, { mime: 'application/x-www-form-urlencoded.js' })({
      path: applicationResourceUrl,
      method: 'POST',
      headers: {
        'Host': url.parse(out.LOCATION).host
      },
      entity: {
        v: 'release-9e8c585405ea9a5cecd82885e8e35d28a16609c6',
        id: 'local:3',
        idle: 'windowclose'
      }
    }).then(function(resp2){
      console.log(resp2);
      var inter = setInterval(function(){
        rest({
          path: applicationResourceUrl,
          headers: {
            'Host': url.parse(out.LOCATION).host
          }
        }).then(function(resp3){
          // console.log(resp3.entity);

          var json2 = parser.toJson(resp3.entity, {
            object: true
          });

          // console.log(json2);

          var connectionUrl = json2.service.servicedata.connectionSvcURL;
          console.log(connectionUrl);
          clearInterval(inter);

          rest.chain(mime, { mime: 'application/json' })({
            path: connectionUrl,
            headers: {
              'Host': url.parse(out.LOCATION).host
            },
            entity: {
              channel: 0
            }
          }).then(function(resp4){
            console.log(resp4);

            var socket = new WebSocket(resp4.entity.URL);
            var interval = 0;
            socket.on('open', function(){
              var message = JSON.stringify(["cv",{"type":"launch_service","message":{"action":"launch","activityType":"video_playback","activityId":"g9rh2radmgcw","initParams":{
                videoUrl: "http://" + myip + ":1337/small.mp4",
                currentTime: 0,
                duration: 0,
                paused: false, //request play
                muted: false,
                volume: 0.8},"senderId":"s16qkwo9ks2x","receiverId":"local:7","disconnectPolicy":"stop"}}]);
              console.log(message);
              socket.send(message);
            });
            socket.on('message', function(data){
              console.log(data, typeof data);
              var pong = JSON.stringify(["cm",{"type":"pong"}]);
              console.log(pong);
              socket.send(pong);
            });
          });
        });
      }, 1000);
    }, function(err){
      console.log(err);
    });
  });
});

client.search('urn:dial-multiscreen-org:service:dial:1');
