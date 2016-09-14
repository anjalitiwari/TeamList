var express          = require( 'express' )
  , app              = express()
  , server           = require( 'http' ).createServer( app ) 
  , passport         = require( 'passport' )
  , util             = require( 'util' )
  , bodyParser       = require( 'body-parser' )
  , cookieParser     = require( 'cookie-parser' )
  , session          = require( 'express-session' )
  , RedisStore       = require( 'connect-redis' )( session )
   , GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy
   , cors = require('cors')

var path = require('path');
var profile={}
var $=require('jquery');
 var reactViews = require('express-react-views');

var GOOGLE_CLIENT_ID      = "208016396744-5gbuktj3og7ga84mim6ee0dg2kdomuu5.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET  = "bj5RWk1G74nxoGLDo_X0W-O8"




passport.serializeUser(function(user, done) {
         done(null, user)
});

passport.deserializeUser(function(obj, done) {
               done(null, obj);
               });



passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:9471/auth/callback/",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
     process.nextTick(function () {
      return done(null, profile);
    });
  }
));


app.use('/', express.static(path.join(__dirname, '/views')));
app.use( cookieParser()); 
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({
	extended: false
}));
app.use( session({ 
	secret: 'cookie_secret',
	name:   'kaas',
	cookie:{
		secure:false
	},
	

	proxy:  true,
    resave: true,
    saveUninitialized: true
}));
app.use( passport.initialize());
app.use( passport.session());


app.get('/auth/google', passport.authenticate('google', { scope: [
'https://www.googleapis.com/auth/userinfo.email',
'https://www.googleapis.com/auth/userinfo.profile'
]
}));

app.get("/teamList",function(req,res){
res.send([{"name":"India","logo":"abc.png"},{"name":"Srilanka","logo":"def.png"}])
})

  app.get("/listPlayers",function(req,res){
res.send(["sachin","hari"])
})


app.get( '/auth/callback/',
        passport.authenticate( 'google', {
                successRedirect: '/home',
                failureRedirect: '/googleplus/login'
}));


app.get('/home', function(req, res){
 res.sendFile(path.join(__dirname+ '/views/home.html'))
});

app.get('/teamPlayers', function(req, res){
 res.sendFile(path.join(__dirname+ '/views/list.html'))
});




server.listen( 9471 );

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
	return next();
  }}
