const express = require('express');
const {searchPlaces} = require('../controller/googlePlacesApi');
const router = express.Router();


router.route('/').get(searchPlaces);


module.exports = router;