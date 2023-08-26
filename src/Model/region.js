const mongoose = require("mongoose");

// Define the Region schema
const RegionSchema = new mongoose.Schema({
  regions: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create the Region model
const Region = mongoose.model("Region", RegionSchema);
// Create the Region model

// Define the State schema
const StateSchema = new mongoose.Schema({
  states: [
    {
      name: {
        type: String,
        required: true,
      },
      region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Region",
        required: true,
      },
    },
  ],
});

// Create the State model
const State = mongoose.model("State", StateSchema);

// Define the City schema
const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true,
  },
});

// Create the City model
const City = mongoose.model("City", CitySchema);



module.exports = {
  Region,
  State,
  City
};
