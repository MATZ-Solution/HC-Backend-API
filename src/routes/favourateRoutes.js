const express = require('express');
const favoriteClt = require('../controller/favourateCotroller');
const { verifyToken } = require("../middleware/verifytokens");
const router = express.Router();



router.post('/createFavourate', verifyToken, favoriteClt.createFavourate)
router.post('/createFavourateApp', verifyToken, favoriteClt.createAndDeleteFavorite)

router.get('/getFavourate', verifyToken, favoriteClt.getFavourate)
router.delete('/dltFavourate/:id', verifyToken, favoriteClt.deleteFavourate)
router.get('/getAllFavourateCategoryId',  favoriteClt.getAllFavourate)



module.exports = router;