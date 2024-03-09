const User = require('../Model/User');
const Favourate = require('../Model/favourateModel');
const notificationModel = require('../Model/notificationModel');
const ErrorHandler = require('../utils/ErrorHandler');
const axios = require('axios');

const favoriteClt = {
  createFavourate: async (req, res, next) => {
    try {
      const { _id, isAdmin } = req.user;
      // console.log(_id,"id")
      const { category, scrapeObjectId } = req.body;
      // console.log(req.body)
      if (isAdmin === 'patient') {
        const newFavorite = new Favourate({
          category,
          scrapeObjectId,
          patId: _id,
        });
        const {email}=await User.findById({_id:_id})
        const notification=await notificationModel.create({
          email:email,
          message:`favourate added`,
          mongoDbID:scrapeObjectId
        })

        await newFavorite.save();

        res.status(201).json({ message: 'Favorite created successfully' });
      } else if (isAdmin === 'super-admin') {
        const newFavorite = new Favourate({
          category,
          scrapeObjectId,
          superAdminId: _id,
        });

        await newFavorite.save();

        res.status(201).json({ message: 'Favorite created successfully' });
      } else if (isAdmin === 'corporate') {
        const newFavorite = new Favourate({
          category,
          scrapeObjectId,
          corporateId: _id,
        });

        await newFavorite.save();

        res.status(201).json({ message: 'Favorite created successfully' });
      }
    } catch (err) {
      next(err);
    }
  },
   createAndDeleteFavorite : async (req, res, next) => {
    try {
      const { _id, isAdmin } = req.user;
      const { category, scrapeObjectId } = req.body;
      
      if (isAdmin === 'patient' || isAdmin === 'super-admin' || isAdmin === 'corporate') {
        let filter = {};
        if (isAdmin === 'patient') {
          filter = { patId: _id };
        } else if (isAdmin === 'super-admin') {
          filter = { superAdminId: _id };
        } else if (isAdmin === 'corporate') {
          filter = { corporateId: _id };
        }
  
        const existingFavorite = await Favourate.findOne({
          ...filter,
          category,
          scrapeObjectId
        });
  
        if (!existingFavorite) {
          const newFavorite = new Favourate({
            category,
            scrapeObjectId,
            ...filter
          });
          await newFavorite.save();
          res.status(201).json({ message: 'Favorite created successfully' });
        } else {
          await Favourate.findOneAndDelete(existingFavorite._id);
          res.status(200).json({ message: 'Favorite deleted successfully' });
        }
      } else {
        res.status(400).json({ error: 'Invalid isAdmin value' });
      }
    } catch (err) {
      next(err);
    }
  },
  

  // Update a branch manager by ID
  getFavourate: async (req, res, next) => {
    try {
      const { _id, isAdmin } = req.user;
      // console.log(req.user,"rew")
      // const apiUrl =
      //   "http://scrapedapi.healthcare.matzsolutions.com/api/healthCareRoute/getCategoryDataUsingMongoId";

      const apiUrl = process.env.getCategory;
      if (isAdmin === 'patient') {
        let getFavourates = await Favourate.find({ patId: _id }).populate(
          'patId'
        );
        // console.log(getFavourates,"dfs")

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
          console.log(getFavourateWithResponse,"sd")
        res.status(200).json(getFavourateWithResponse);
      } else if (isAdmin === 'super-admin') {
        let getFavourates = await Favourate.find({
          superAdminId: _id,
        }).populate('patId');

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
      } else if (isAdmin === 'corporate') {
        let getFavourates = await Favourate.find({
          corporateId: _id,
        }).populate('patId');

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
      console.log(err)
      next(err);
    }
  },

 

  // Delete a branch manager by ID
  deleteFavourate: async (req, res, next) => {
    try {
      const deleteFavourate = await Favourate.findOneAndDelete({
        scrapeObjectId: req.params.id,
      });
      if (!deleteFavourate) {
        res.status(404).json({ error: 'not found.' });
      }
      res.status(200).json({ message: 'deleted successfully.' });
    } catch (err) {
      next(err);
    }
  },
  getAllFavourate:async(req,res,next)=>{
    try{
      const getAllFavourate=await Favourate.find()
      // console.log(getAllFavourate.length)
      res.json(getAllFavourate)
    }
    catch(err){

    }
  }
};
module.exports = favoriteClt;
