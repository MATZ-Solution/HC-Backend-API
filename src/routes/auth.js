const router = require("express").Router();
const {
  registerController,
  loginController,
  registerWithSocialMedia,
  loginWithSocialMedia,
  // userDataController
} = require("../controller/auth_Controller");
const { verifyToken, verifyGoogleToken } = require("../middleware/verifytokens");
//REGISTER

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/loginAuth",registerWithSocialMedia)

// router.post("/socialAuth", registerWithSocialMedia);
// router.get("/registerAuth",verifyGoogleToken,registerWithSocialMedia)
// router.get("/loginAuth",verifyGoogleToken,loginWithSocialMedia)
// router.get('/userInfo',verifyToken,userDataController)


module.exports = router;
