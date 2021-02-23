var express = require('express');
var app = express();
// const port = 3000;
var productComponent = require('./components/products');
var userComponent = require('./components/users');
var bodyParser = require('body-parser');
var cors = require('cors');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.set('port', (process.env.PORT || 80));

app.get('/', (req, res) => res.send('unprotected'));

passport.use(new BasicStrategy(
  function(username, password, done) {
    const user = users.getUserByName(username);
    if(user == undefined) {
      console.log("HTTP Basic username not found");
      return done(null, false, {message: "HTTP Basic username not found"});
    }
    if(bcrypt.compareSync(password, user.password) == false) {
      console.log("HTTP Basic password not matching username");
      return done(null, false, {message: "HTTP Basic password not found"});
    }
    return done(null, user);
  }
))



app.get('/protected',
  passport.authenticate('basic', {session: false}),
  (req, res) => {res.json({yourProtectedResource: "profit"});
});


//Routes
app.use('/products', productComponent );
app.use('/users', userComponent);

let serverInstance = null;

app.get('/', function(req, res) {
  res.send("Hello class, this is automatic deploy demo");
});


module.exports = {
  start: function() {
    serverInstance = app.get('port', function() {
      console.log('Node app is running on port', app.get('port'));
    })
  },
  close: function() {
    serverInstance.close();
  }
}