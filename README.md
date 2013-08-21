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

Emits an event when a device is found. Receives device info (may or may not be relevant).

```javascript
chromecast.on('device', function(device){
  // device contains device info
});
```

### discover

Chromecast starts looking for devices.

```javascript
chromecast.discover();
```

### launch

Chromecast launches an app with given data.

```javascript
chromecast.on('device', function(){
  this.launch('YouTube', {
    v: 'cKG5HDyTW8o'
  });
});
```

### appInfo

Chromecast retrieves info about app.

```javascript
chromecast.on('device', function(){
  this.launch('ChromeCast', {
    v: 'release-9e8c585405ea9a5cecd82885e8e35d28a16609c6'
  }).then(function(){
    return chromecast.appInfo();
  }).then(function(appInfo){
    console.log(appInfo);
  });
});
```

### connectionUrl

Chromecast retrieves the connection url for app.

```javascript
chromecast.on('device', function(){
  this.launch('ChromeCast', {
    v: 'release-9e8c585405ea9a5cecd82885e8e35d28a16609c6'
  }).then(function(){
    return chromecast.appInfo();
  }).then(function(appInfo){
    return chromecast.connectionUrl(appInfo);
  }).then(function(connectionUrl){
    console.log(connectionUrl);
  });
});
```

## TODO:

* More docs
