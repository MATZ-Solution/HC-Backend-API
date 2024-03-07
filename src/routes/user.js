const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndCorporate,
} = require('../middleware/verifytokens');
const {
  changePasswordController,
  deleteUserController,
  sendEmail,
  forgotPasswordController,
  verifyEmail,
  verifyOtp,
  updatedUser,
  userInfoController,
  verifyforgetPasswordOtp,
  allUsers,
  patApplyforcoroporate,
  getPatApplyService,
  specificCorporateData,
  isAdminApprovePatientService,
  getAllCorporates,
  updatedProfile,
  toConnectCorporate,
  noOfCallsMadeMethod,
  getMedicalPracticeForIndividualUser,
  getpatrequest,
  userInfoNameController,
  getNotifications,
  cancelNotifications
} = require('../controller/user_Controller');
const router = require('express').Router();

router.put('/changePassword', verifyToken, changePasswordController);
router.delete('/deleteAccount', verifyToken, deleteUserController);
router.get('/userInfo', verifyToken, userInfoController);
router.get('/userInfoName',verifyToken,userInfoNameController)
router.post('/sendEmail', sendEmail);
router.post('/forgotPassword', forgotPasswordController);
router.post('/verifyEmail', verifyEmail);
router.post('/verifyOtp', verifyOtp);
router.post('/verifyforgetPasswordOtp', verifyforgetPasswordOtp);
router.put('/UpdateUser', updatedUser);
router.post('/PatientApplyForService', patApplyforcoroporate);

//updateUserProfileUsingToken

router.put('/UpdateProfile', verifyToken, updatedProfile);

//corporate viewing his own patient data
router.get(
  '/specificCorporateData',
  verifyTokenAndCorporate,
  specificCorporateData
);

//approve admin statusisAdminApprovePatientService

router.put(
  '/approvePatientServiceByAdmin/:patMongoId',
  verifyTokenAndAdmin,
  isAdminApprovePatientService
);

//super Admin
router.get('/getAllRegisteredPatient', verifyTokenAndAdmin, allUsers);
router.get('/getAllPatServices', getPatApplyService);
router.get('/getAllCorporates', verifyTokenAndAdmin, getAllCorporates);

//patient connecting corporate
router.post('/toConnectCorporate', verifyToken, toConnectCorporate);

//noOfCallsMadeByPatient
router.post('/noOfCallsMade', verifyTokenAndCorporate, noOfCallsMadeMethod);

//getMedicalPracticeForIndividualUser

router.post(
  '/getMedicalPracticeForIndividualUser',
  verifyToken,
  getMedicalPracticeForIndividualUser
);

//getpatapplyserviceforpat

router.get('/getPatRequest', verifyToken, getpatrequest);
router.get("/getNotification",verifyToken,getNotifications);
router.get("/cancelNotification",verifyToken,cancelNotifications);

module.exports = router;
