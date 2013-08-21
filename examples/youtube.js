var chromecast = require('../')();

chromecast.on('device', function(){

  this.launch('YouTube', {
    v: 'cKG5HDyTW8o'
  }).then(function(){
    console.log('Watch Your TV!');
  }, function(err){
    console.error('Something Went Wrong: ', err);
  });

});

chromecast.discover();
