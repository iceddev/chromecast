# ChromeCast

Initial chromecast work

## API

### Chromecast

```javascript
var chromecast = require('chromecast')();
```

Initialize a new Chromecast object.

A Chromecast object is an event emitter.

### Events:

#### device

Emits an event when a device is found. Receives a Device object.

```javascript
chromecast.on('device', function(device){
  // device is the chromecast device
});
```

### discover

Chromecast starts looking for devices.

```javascript
chromecast.discover();
```

### Device

A Chromecast Device object

### launch

Device launches an app with given data.

```javascript
chromecast.on('device', function(device){
  device.launch('YouTube', {
    v: 'cKG5HDyTW8o'
  });
});
```

### appInfo

Device retrieves info about app.

```javascript
chromecast.on('device', function(device){
  device.launch('ChromeCast', {
    v: 'release-9e8c585405ea9a5cecd82885e8e35d28a16609c6'
  }).then(function(){
    return device.appInfo();
  }).then(function(appInfo){
    console.log(appInfo);
  });
});
```

### connectionUrl

Device retrieves the connection url for app.

```javascript
chromecast.on('device', function(device){
  device.launch('ChromeCast', {
    v: 'release-9e8c585405ea9a5cecd82885e8e35d28a16609c6'
  }).then(function(){
    return device.appInfo();
  }).then(function(appInfo){
    return device.connectionUrl(appInfo);
  }).then(function(connectionUrl){
    console.log(connectionUrl);
  });
});
```

## TODO:

* More docs
