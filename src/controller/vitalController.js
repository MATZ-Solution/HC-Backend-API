const Vital = require("../Model/vitalModel");
const User = require("../Model/User");


// Controller to create a new vital record
const createVital = async (req, res, next) => {
  try {
    const {heartRatePulse, bloodPressure, respiratoryRate, bodyTemperature, bloodOxygen, bodyWeight, bodyGlucoseLevel, medicalReports } = req.body;

    const newVital = new Vital({
      userId:req.user._id,
      heartRatePulse,
      bloodPressure,
      respiratoryRate,
      bodyTemperature,
      bloodOxygen,
      bodyWeight,
      bodyGlucoseLevel,
      medicalReports,
    });

    const updateUserVital =await User.findOneAndUpdate(
        {_id:req.user._id},
        {isVital:true},
        {new:true}
    )
    console.log(updateUserVital)

    const savedVital = await newVital.save();
    res.status(201).json(savedVital);
  } catch (err) {
    next(err);
  }
};

// Controller to update an existing vital record
const updateVital = async (req, res, next) => {
  try {
    const { vitalId } = req.params;
    const { heartRatePulse, bloodPressure, respiratoryRate, bodyTemperature, bloodOxygen, bodyWeight, bodyGlucoseLevel, medicalReports } = req.body;

    const updatedVital = await Vital.findByIdAndUpdate(
      vitalId,
      {
        heartRatePulse,
        bloodPressure,
        respiratoryRate,
        bodyTemperature,
        bloodOxygen,
        bodyWeight,
        bodyGlucoseLevel,
        medicalReports,
      },
      { new: true }
    );

    if (!updatedVital) {
      return res.status(404).json({ message: "Vital record not found." });
    }

    res.status(200).json(updatedVital);
  } catch (err) {
    next(err);
  }
};

// Controller to get all vitals for a specific user
const getVitalsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const vitals = await Vital.find({ userId });

    if (vitals.length === 0) {
      return res.status(404).json({ message: "No vitals found for the specified user." });
    }

    res.status(200).json(vitals);
  } catch (err) {
    next(err);
  }
};

module.exports = { createVital, updateVital, getVitalsByUserId };
