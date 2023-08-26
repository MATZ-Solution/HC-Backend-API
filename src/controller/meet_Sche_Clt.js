const meetmodel = require("../Model/meet_Sche_Model");
const ErrorHandler = require("../utils/ErrorHandler");


const meetClt = {
    bookSchedule: async (req, res, next) => {
      try {
        const { Name, contactNo,Email,selectDate,setTime } = req.body;
        const privacy = await meetmodel.create({
            Name,
            contactNo,
            Email,
            selectDate,
            setTime,
            user: req.user._id
        });
        res.status(200).json({
          success: true,
          privacy,
        });
      } catch (err) {
        next(err);
      }
    },
    getbookSchedule: async (req, res, next) => {
      try {
        const currentDate = new Date(); // Get the current date and time
        const meetSchedule = await meetmodel.find({ user: req.user._id });
        
        const upcoming = []; // Array to store upcoming meetings
        const missed = []; // Array to store missed meetings
        
        meetSchedule.forEach((meet) => {
          const selectDate = new Date(meet.selectDate);
          if (selectDate > currentDate || selectDate == currentDate) {
            // Meeting is in the future, add to the upcoming array
            upcoming.push(meet);
          } else {
            // Meeting has already passed, add to the missed array
            missed.push(meet);
          }
        });
        
        res.status(200).json({ upcoming:upcoming, missed:missed });
      } catch (err) {
        next(err);
      }
    }
  };
  module.exports = meetClt;
  