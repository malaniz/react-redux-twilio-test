var domain = 'http://localhost:6661';
var config = {
  development: {
    TWILIO: {
      ID:'e85fe925fb124b5bc3',
      TOKEN: '219a89e3d13b2eb60'
    },
    MAIL: { 
      USER: 'tumail@gmail.com',
      PASS: 'tupassword',
      TRANSPORT: 'SMTP'
    },

    APP: {
      DB_URL: 'mongodb://localhost/xxx',
      CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
      PORT: process.env.PORT || 8081,
      TMP_DIR: 'tmp/',
      UPLOAD_DIR: __dirname + '/app/uploads/'
    }
  },
  production: {
    MAIL: { 
      USER: 'tumail@gmail.com',
      PASS: 'tupassword',
      TRANSPORT: 'SMTP'
    },

    APP: {
      DB_URL: 'mongodb://localhost/xxx',
      CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
      PORT: process.env.PORT || 8081,
      TMP_DIR: 'tmp/',
      UPLOAD_DIR: __dirname + '/app/uploads/'
    }
  }
}

function init(app){
  var mode = app.get('env');
  return config[mode];
}

exports.init = init;
