var express    = require('express')
  , cors       = require('cors')
  , http       = require('http')
  , path       = require('path')
  , bodyParser = require('body-parser')
  , app        = express()
  , config     = require('./config').init(app)
  , mongoClient= require('mongodb').MongoClient
  , session    = require('express-session')
  , message    = require('./message')
  , secret     = "4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$"
  , twilio     = require('twilio');
  ;

// middleware
app.use(cors());
app.use( bodyParser.json({limit: '50mb'})                                  );
app.use( bodyParser.urlencoded({limit: '50mb', extended: true})            );
app.use( session({ secret: secret, resave: true, saveUninitialized: true}) );

// starting persistence connection
mongoClient.connect(config.APP.DB_URL, function(err, db){
  
  var twilioConnection = new twilio.RestClient(config.TWILIO.ID, config.TWILIO.TOKEN);
  if (err) {
    console.log('Error: Can not connecto to db: ', db, err);
    return;
  }

  // url definitions
  app.post( '/api/message/send', message.send(db,twilioConnection) );

  // url 404
  app.all('*', function(req, res){ 
    res.status(404).json({ err: 'ROUTE_NOT_FOUND'});
  });

  // run the server
  http.createServer(app).listen(config.APP.PORT, function() { 
    console.log("\n[*] Server Listening on port %d", config.APP.PORT); 
  });

});

