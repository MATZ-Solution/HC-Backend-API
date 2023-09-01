const express = require('express');
const favoriteClt = require('../controller/favourateCotroller');
const { verifyToken } = require("../middleware/verifytokens");
const router = express.Router();



router.post('/createFavourate', verifyToken, favoriteClt.createFavourate)
router.get('/getFavourate', verifyToken, favoriteClt.getFavourate)
router.delete('/dltFavourate/:id', verifyToken, favoriteClt.deleteFavourate)


module.exports = router;