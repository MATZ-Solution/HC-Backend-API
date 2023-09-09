const express = require('express');
const FCM_Clt = require('../controller/fcm_Controller');
const { verifyToken } = require('../middleware/verifytokens');
const router = express.Router();

router.post('/createFcm', verifyToken, FCM_Clt.createFCM);
// router.get('/getFavourate',  favoriteClt.getFavourate);
// router.delete('/dltFavourate/:id', verifyToken, favoriteClt.deleteFavourate);

module.exports = router;
