var EventEmitter = require('events').EventEmitter;
var util = require('util');

var rest = require('rest');
var mime = require('rest/interceptor/mime');

var dial = require('dial');

function connectionUrl(appInfo){
  var self = this;

  var client = rest.chain(mime, { mime: 'application/json' });

  var url = appInfo.service.servicedata.connectionSvcURL;
  if(!url){
    return this.appInfo().then(function(appInfo){
      return self.connectionUrl(appInfo);
    });
  }

  return client({
    path: url,
    entity: {
      channel: 0
    }
  });
}

function Chromecast(){
  if(!(this instanceof Chromecast)) return new Chromecast();

  var self = this;

  EventEmitter.call(self);

  dial.on('device', function(device){
    if(device.model !== 'Eureka Dongle'){
      // Not a Chromecast
      return;
    }

    // Add connectionUrl method to a device
    device.connectionUrl = connectionUrl;

    self.emit('device', device);
  });

}

util.inherits(Chromecast, EventEmitter);

Chromecast.prototype.discover = function(){
  dial.discover();
};

module.exports = Chromecast;
