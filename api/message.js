
exports.send = function (db, client) {
  return function(req, res){
    client.sms.messages.create({
      to:'destiny-phone',
      from:'twillio-phone',
      body: req.body.data
    }, function(error, message) {
      if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
        console.log('Message sent on:');
        console.log(message.dateCreated);

        db.collection('messages').insert(message, function(err, result){
          if (err) { 
            res.status(500).json({err: 'problems with insertion in database'});
            return;
          }
          res.json({data: message});
        });
      } else {
        console.log('Oops! There was an error.');
        res.status(500).json({err: "We can't send your message"});
      }
    });
  };
};

exports.list = function(db){
  return function(req, res){
    db.collection('messages').find().toArray(function(err, result){
      res.json({message: result});
    });
  };
};
