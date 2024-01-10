const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require("passport");
require('dotenv').config()

const { default: axios } = require("axios");
passport.use(new GoogleStrategy({
    clientID:    "314005293340-fj82kqi8e4br6ocpvfhgrhc6i5e237t1.apps.googleusercontent.com",
    clientSecret: "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",
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
catch(err){
    console.log(err)
}
 }
));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
