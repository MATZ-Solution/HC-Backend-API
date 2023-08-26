const { Region, State, City, ZipCode } = require("../Model/region");
const ErrorHandler = require("../utils/ErrorHandler");

const regionController = {
  createRegion: async (req, res, next) => {
    try {
      const { regions } = req.body;

      const saveregions = await Region.create({ regions });

      res.status(201).json({
        success: true,
        message: "Regions created successfully",
        data: saveregions,
      });
    } catch (error) {
      next(error);
    }
  },
  getRegion: async (req, res, next) => {
    try {
      const regionsData = await Region.find({}).select("regions -_id");

      const regions = regionsData[0].regions;

      res.status(200).json({
        success: true,
        data: regions,
      });
    } catch (error) {
      next(error);
    }
  },
};

const stateController = {
  createState: async (req, res, next) => {
    try {
      const { states } = req.body;

      const savedstate = await State.create({ states });

      res.status(201).json({
        success: true,
        message: "State created successfully",
        data: savedstate,
      });
    } catch (error) {
      next(error);
    }
  },
  getState: async (req, res, next) => {
    try {
      const { regionId } = req.params;

      const statesData = await State.find({}).select("states -_id");
      const states = statesData[0].states;

      const statesarr = states.filter((state) => state.region == regionId);

      if (!states.length) {
        return res.status(404).json({
          success: false,
          message: "No states found for the provided region",
        });
      }

      res.status(200).json({
        success: true,
        states: statesarr,
      });
    } catch (error) {
      next(error);
    }
  },
};

const cityController = {
  createCity: async (req, res, next) => {
    try {
      const cities = req.body; // Assuming the request body contains an array of cities
      
      const savedCities = await Promise.all(
        cities.map(async (city) => {
          const { name, state } = city;
          const savedCity = await City.create({ name, state });
          return savedCity;
        })
      );

      res.status(201).json({
        success: true,
        message: "Cities created successfully",
        data: savedCities,
      });
    } catch (error) {
      next(error);
    }
  },
  getCities: async (req, res, next) => {
    try {
      const { state } = req.params;

      const citiesData = await City.find({ state }).select("name");

      res.status(200).json({
        success: true,
        cities: citiesData,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = {
  regionController,
  stateController,
  cityController,
};
