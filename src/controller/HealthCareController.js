const ErrorHandler = require("../utils/ErrorHandler");
const HealthCare = require("../Model/healthCareData");


const healthCareController = {
  addData: async (req, res, next) => {
    try {
      const data = req.body; // Assuming req.body contains an array of data objects

      const newData = [];

      for (let i = 0; i < data.length; i++) {
        const { website, phoneNumber, address, closed, openingHours } = data[i];
        
        const addressData = address.split(",");
        const fullAddress = addressData[0].trim();
        const cityZip = addressData[1].trim();
        const [state, zipCode] = cityZip.split(" ");

        const newHealthCare = new HealthCare({
          website,
          phoneNumber,
          address: {
            fullAddress,
            zipCode,
            state:"Washington DC"
          },
          closed,
          openingHours:openingHours[0],
        });

        await newHealthCare.save();
        newData.push(newHealthCare);
      }

      res.status(200).json({
        success: true,
        message: "Data added successfully",
        data: newData,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = healthCareController;
