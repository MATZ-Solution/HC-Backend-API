const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
require('dotenv').config()

const { default: axios } = require("axios");
passport.use(new GoogleStrategy({
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
  },
 async function(accessToken, refreshToken,profile, done) {
    try{
    const emailResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const user=emailResponse.data
   
    
    return done(null, user);
    
   
}
catch(err) {
    console.error(err);
    return done(err);
}
 }
));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
