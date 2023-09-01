const Favourate = require("../Model/favourateModel");
const ErrorHandler = require("../utils/ErrorHandler");

const favoriteClt = {
    createFavourate: async (req, res, next) => {
        try {
            const { _id, isAdmin } = req.user;
            const { category, scrapeObjectId } = req.body;

            if (isAdmin === "patient") {

                const newFavorite = new Favourate({
                    category,
                    scrapeObjectId,
                    patId: _id
                });

                await newFavorite.save();

                res.status(201).json({ message: "Favorite created successfully" });
            } else if (isAdmin === "super-admin") {
                const newFavorite = new Favourate({
                    category,
                    scrapeObjectId,
                    superAdminId: _id
                });

                await newFavorite.save();

                res.status(201).json({ message: "Favorite created successfully" });

            } else if (isAdmin === "corporate") {
                const newFavorite = new Favourate({
                    category,
                    scrapeObjectId,
                    corporateId: _id
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
            const { _id } = req.user;

            const apiUrl = 'http://scrapedapi.healthcare.matzsolutions.com/api/healthCareRoute/getCorporatesUsingMongoId';

            let getFavourates = await Favourate.find({ patId: _id });


            // const complaintsWithResponses = await Promise.all(
            //     corporate.complaintIds.map(async complaint => {
            //       const response = await axios.post(apiUrl, {
            //         mongoDbID: complaint.mongoDbID,
            //         category: complaint.category
            //       });

            //       if (response.status === 200) {
            //         return response.data;
            //       } else {
            //         return [];
            //       }
            //     })
            // );

            // const getFavourateWithResponse = await Promise.all(



            // getFavourates.map(favourate => {
            //     console.log(favourate);
            //     const response = await axios.post(apiUrl, {
            //         mongoDbID: complaint.mongoDbID,
            //         category: complaint.category
            //     });


            // });

            // if (!getFavourates) {
            //     res.status(404).json("Record Not Found");
            // }

            // res.status(200).json(getFavourates)
        } catch (err) {
            next(err);
        }
    },

    // Delete a branch manager by ID
    deleteFavourate: async (req, res, next) => {
        try {
            console.log(req.params.id)
            const deleteFavourate = await Favourate.findByIdAndDelete(
                req.params.id
            );
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
