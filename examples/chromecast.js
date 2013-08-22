var WebSocket = require('ws');
var chromecast = require('../')();

chromecast.on('device', function(device){

  device.launch('ChromeCast', {
    v: 'release-9e8c585405ea9a5cecd82885e8e35d28a16609c6'
  }).then(function(){
    return device.appInfo();
  }).then(function(appInfo){
    return device.connectionUrl(appInfo);
  }).then(function(resp){

    var socket = new WebSocket(resp.entity.URL);
    socket.on('open', function(){

      // This message starts a video using the chromecast app, no need for RAMP
      var message = JSON.stringify(["cv",{
        "type":"launch_service",
        "message":{
          "action":"launch",
          "activityType": "video_playback",
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
  }, function(err){
    console.error('Something Went Wrong: ', err);
  });
});

chromecast.discover();
