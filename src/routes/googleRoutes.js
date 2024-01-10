const router = require("express").Router();
const passport=require('passport');
const { loginWithSocialMedia } = require("../controller/auth_Controller");
require('dotenv').config()
require('../utils/passport')




router.get("/auth/protected", (req, res,next) => {
  res.redirect("https://infosenior.care")
    next()
},loginWithSocialMedia);

router.get("/login/failure", (req, res) => {
	res.send("Something Went Wrong")
});

router.get('/auth/google',
  passport.authenticate('google', {scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ] })
)

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {failureRedirect: "/login/failure",successRedirect:"/auth/protected"}),
   );

// router.get("/logout", (req, res) => {
// 	req.logout();
// 	// res.redirect(process.env.CLIENT_URL);
// });




module.exports = router;
