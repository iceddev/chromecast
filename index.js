var delay = require('when/delay');
var rest = require('rest');
var mime = require('rest/interceptor/mime');

var WebSocket = require('ws');
var dial = require('dial')();

dial.on('device', function(device){

  var client = this.client
    .chain(mime, { mime: 'application/json' });

  if(device.root.device.modelName !== 'Eureka Dongle'){
    return;
  }

  dial.launch('ChromeCast', {
    v: 'release-9e8c585405ea9a5cecd82885e8e35d28a16609c6',
    id: 'local:3',
    idle: 'windowclose'
  }).then(function(){
    // if we do a request right after launch, we don't get the needed info
    // so delay by 1 second
    return delay(1000);
  }, function(err){
    console.log(err);
  }).then(function(){
    return dial.appInfo();
  }).then(function(appInfo){

    var connectionUrl = appInfo.service.servicedata.connectionSvcURL;
    if(!connectionUrl){
      return;
    }

    return client({
      path: connectionUrl,
      entity: {
        channel: 0
      }
    });
  }).then(function(resp){

    var socket = new WebSocket(resp.entity.URL);
    socket.on('open', function(){
      var message = JSON.stringify(["cv",{
        "type":"launch_service",
        "message":{
          "action":"launch",
          "activityType":
          "video_playback",
          "activityId":"1zmakgx2pneu",
          "initParams":{
            videoUrl: "http://techslides.com/demos/sample-videos/small.mp4",
            currentTime: 0,
            duration: 0,
            paused: false, //request play
            muted: false,
            volume: 0.8
          }
        }
      }]);
      console.log('sending:   ', message);
      socket.send(message);
    });
    socket.on('message', function(data){
      console.log('receiving: ', data);
      var pong = JSON.stringify(["cm",{"type":"pong"}]);
      console.log('sending:   ', pong);
      socket.send(pong);
    });
  });
});

dial.discover();
