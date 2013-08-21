var EventEmitter = require('events').EventEmitter;
var util = require('util');

var mime = require('rest/interceptor/mime');

var Dial = require('dial');

function Chromecast(){
  if(!(this instanceof Chromecast)) return new Chromecast();

  var self = this;

  EventEmitter.call(self);

  self.dial = Dial();

  self.dial.on('device', function(device){
    if(device.root.device.modelName !== 'Eureka Dongle'){
      // Not a Chromecast
      return;
    }

    self.client = self.dial.client
      .chain(mime, { mime: 'application/json' });

    self.emit('device', device);
  });

}

util.inherits(Chromecast, EventEmitter);

Chromecast.prototype.discover = function(){
  this.dial.discover();
};

Chromecast.prototype.launch = function(applicationName, data, cb){
  // TODO: check valid app
  return this.dial.launch(applicationName, data, cb);
};

Chromecast.prototype.appInfo = function(applicationResourceUrl, cb){
  return this.dial.appInfo(applicationResourceUrl, cb);
};

Chromecast.prototype.connectionUrl = function(appInfo){
  var self = this;
  var url = appInfo.service.servicedata.connectionSvcURL;
  if(!url){
    return this.appInfo().then(function(appInfo){
      return self.connectionUrl(appInfo);
    });
  }

  return this.client({
    path: url,
    entity: {
      channel: 0
    }
  });
};

module.exports = Chromecast;
