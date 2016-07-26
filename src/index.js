let express = require('express'),
    session = require('express-session'),
    https = require('https'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    SequelizeStore = require('connect-session-sequelize')(session.Store),
    sessionDB = require('./sessionDB.js'),
    dataDB = require('./dataDB.js'),
    fitbitConfig = require('../config/fitbit.js'),
    passport = require('passport');

let app = express();

//setup session
app.use(bodyParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'dzfgkjlh43er90fdbasdlkj43',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: new SequelizeStore({
      db: sessionDB
  })
}))

//setup fitbit auth
// app.use(passport.initialize());
// app.use(passport.session({
//   resave: false,
//   saveUninitialized: true
// }));

// passport.use(new OAuth2Strategy({
//     authorizationURL: fitbitConfig.authUri,
//     tokenURL: fitbitConfig.refreshUri,
//     clientID: fitbitConfig.clientId,
//     clientSecret: fitbitConfig.clientSecret,
//     callbackURL: "https://localhost:8030/auth/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     DataDB.User.findOrCreate({ where: {id: profile.id }, default: {
//         id: profile.id,
//         accessToken: accessToken
//     }).function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// app.get('/auth',
//   passport.authenticate('oauth2'));

// app.get('/auth/callback',
//   passport.authenticate('oauth2', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

// app.get('')

https.createServer({
    key: fs.readFileSync('../dev-resources/cert/server.key'),
    cert: fs.readFileSync('../dev-resources/cert/server.crt')
}, app).listen(8030);