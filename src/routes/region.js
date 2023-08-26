const express = require('express');
const router = express.Router();
const {
  regionController,
  stateController,
  cityController,
} = require('../controller/Region');
const { verifyToken } = require("../middleware/verifytokens");


// Regions
router.post('/regions', regionController.createRegion);
router.get('/regions',regionController.getRegion);

// States
router.post('/states', stateController.createState);
router.get('/states/:regionId',stateController.getState);

// Cities
router.post('/cities', cityController.createCity);
router.get('/cities/:state',cityController.getCities);


module.exports = router;
