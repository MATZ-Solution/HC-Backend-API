const Favourate = require("../Model/favourateModel");
const ErrorHandler = require("../utils/ErrorHandler");
const axios = require("axios");

const favoriteClt = {
  createFavourate: async (req, res, next) => {
    try {
      const { _id, isAdmin } = req.user;
      const { category, scrapeObjectId } = req.body;

      if (isAdmin === "patient") {
        const newFavorite = new Favourate({
          category,
          scrapeObjectId,
          patId: _id,
        });

        await newFavorite.save();

        res.status(201).json({ message: "Favorite created successfully" });
      } else if (isAdmin === "super-admin") {
        const newFavorite = new Favourate({
          category,
          scrapeObjectId,
          superAdminId: _id,
        });

        await newFavorite.save();

        res.status(201).json({ message: "Favorite created successfully" });
      } else if (isAdmin === "corporate") {
        const newFavorite = new Favourate({
          category,
          scrapeObjectId,
          corporateId: _id,
        });

        await newFavorite.save();

        res.status(201).json({ message: "Favorite created successfully" });
      }
    } catch (err) {
      next(err);
    }
  },

  // Update a branch manager by ID
  getFavourate: async (req, res, next) => {
    try {
      const { _id, isAdmin } = req.user;

      const apiUrl =
        "http://scrapedapi.healthcare.matzsolutions.com/api/healthCareRoute/getCategoryDataUsingMongoId";

      if (isAdmin === "patient") {
        let getFavourates = await Favourate.find({ patId: _id }).populate(
          "patId"
        );

        const getFavourateWithResponse = await Promise.all(
          getFavourates.map(async (favourate) => {
            const response = await axios.post(apiUrl, {
              mongoDbID: favourate.scrapeObjectId, //mongoDbID
              category: favourate.category, // category
            });
            return response.data;
            // return {
            //     // databaseResponse: favourate.patId,
            //     apiResponse: response.data,
            // };
          })
        );

        res.status(200).json(getFavourateWithResponse);
      } else if (isAdmin === "super-admin") {
        let getFavourates = await Favourate.find({
          superAdminId: _id,
        }).populate("patId");

        const getFavourateWithResponse = await Promise.all(
          getFavourates.map(async (favourate) => {
            const response = await axios.post(apiUrl, {
              mongoDbID: favourate.scrapeObjectId, //mongoDbID
              category: favourate.category, // category
            });
            return response.data;
            // return {
            //     // databaseResponse: favourate.patId,
            //     apiResponse: response.data,
            // };
          })
        );

        res.status(200).json(getFavourateWithResponse);
      } else if (isAdmin === "corporate") {
        let getFavourates = await Favourate.find({
          corporateId: _id,
        }).populate("patId");

        const getFavourateWithResponse = await Promise.all(
          getFavourates.map(async (favourate) => {
            const response = await axios.post(apiUrl, {
              mongoDbID: favourate.scrapeObjectId, //mongoDbID
              category: favourate.category, // category
            });
            return response.data;
            // return {
            //     // databaseResponse: favourate.patId,
            //     apiResponse: response.data,
            // };
          })
        );

        res.status(200).json(getFavourateWithResponse);
      }
    } catch (err) {
      next(err);
    }
  },

  // Delete a branch manager by ID
  deleteFavourate: async (req, res, next) => {
    try {
      console.log(req.params.id);
      const deleteFavourate = await Favourate.findByIdAndDelete(req.params.id);
      if (!deleteFavourate) {
        res.status(404).json({ error: "not found." });
      }
      res.status(200).json({ message: "deleted successfully." });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = favoriteClt;
