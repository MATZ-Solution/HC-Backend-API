const Favourate = require("../Model/favourateModel");
const ErrorHandler = require("../utils/ErrorHandler");

const favoriteClt = {
    createFavourate: async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { category, scrapeObjectId } = req.body;

            // Create a new favorite
            const newFavorite = new Favourate({
                category,
                scrapeObjectId,
                patId: _id
            });

            // Save the new favorite to the database
            await newFavorite.save();

            res.status(201).json({ message: "Favorite created successfully" });

        } catch (err) {
            next(err);
        }
    },

    // Update a branch manager by ID
    getFavourate: async (req, res, next) => {
        try {
            const { _id } = req.user;
            let getFavourates = await Favourate.find({ patId:_id });
            if (!getFavourates) {
                res.status(404).json("Record Not Found");
            }

            res.status(200).json(getFavourates)
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
