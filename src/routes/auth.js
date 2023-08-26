const router = require("express").Router();
const {
  registerController,
  loginController,
  registerWithSocialMedia
} = require("../controller/auth_Controller");
//REGISTER

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/socialAuth", registerWithSocialMedia);


module.exports = router;
