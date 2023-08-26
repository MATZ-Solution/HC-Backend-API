const ServicesModel = require("../Model/servicesModel");
const servicesTimeSlotsArray = require("../Model/serviceTImeSlots");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../Model/User");
const axios = require("axios");

const serviceClt = {
  createService: async (req, res, next) => {
    try {
      const { servicesType, serviceDetail, serviceCharges, timeSlotsArray } =
        req.body;

      const timeSlotsArrayDocument = new servicesTimeSlotsArray({
        timeSlots: timeSlotsArray,
        otherCareId: req.user._id,
      });

      const savedTimeSlotsArray = await timeSlotsArrayDocument.save();

      const service = new ServicesModel({
        servicesType,
        serviceDetail,
        serviceCharges,
        openingWorkHours: savedTimeSlotsArray._id,
        otherCareId: req.user._id,
      });
      const savedService = await service.save();
      res.status(201).json(savedService);
    } catch (err) {
      next(err);
    }
  },
  getServices: async (req, res, next) => {
    try {
      //get patid from token
      const patId = req.user._id;
      //find user
      const user = await User.findOne({ _id: patId });

      //get longitude and latitude
      const zipCodeData = await axios.get(
        `https://api.zippopotam.us/us/${user.zipCode}`
      );
      const { latitude: patientLat, longitude: patientLon } =
        zipCodeData.data.places[0];

      // Retrieve all services from the database
      const services = await ServicesModel.find({
        isApprovedbySuperAdmin: true,
      })
        .populate("otherCareId", "")
        .populate("openingWorkHours")
        .exec();

      //if service not found give error
      if (!services) {
        throw new ErrorHandler(404, "Service not found");
      }

      const getDoctorLatLng = async (zipCode) => {
        const zipCodeData = await axios.get(
          `https://api.zippopotam.us/us/${zipCode}`
        );
        const { latitude, longitude } = zipCodeData.data.places[0];
        return { latitude, longitude };
      };

      const formattedServices = await Promise.all(
        services.map(async (service) => {
          const {
            otherCareMedicalSpecialization,
            _id,
            email,
            role,
            gender,
            UploadLegalDoc,
            EducationCertificateDetails,
            LicenseNo,
            address,
            city,
            dateOfBirth,
            firstName,
            lastName,
            otherCareIssuingAuthority,
            otherCareIssuingDate,
            phoneNumber,
            profilePic,
            region,
            state,
            zipCode,
          } = service.otherCareId;
          const {
            id,
            servicesType,
            serviceDetail,
            serviceCharges,
            isApprovedbySuperAdmin,
          } = service;
          const { timeSlots, otherCareId } = service.openingWorkHours;

          const { latitude: doctorLat, longitude: doctorLon } =
            await getDoctorLatLng(zipCode);

          // Calculate the distance between the patient and the doctor
          const distance = calculateDistance(
            patientLat,
            patientLon,
            doctorLat,
            doctorLon
          );

          return {
            otherCareMedicalSpecialization,
            otherCareId: _id,
            otherCareEamil: email,
            role,
            gender,
            serviceId:id,
            servicesType,
            serviceDetail,
            serviceCharges,
            ServiceApprove: isApprovedbySuperAdmin,
            UploadLegalDoc,
            openingWorkingHours: timeSlots,
            timeSlotsOtherCareId: otherCareId,
            EducationCertificateDetails,
            LicenseNo,
            address,
            city,
            dateOfBirth,
            firstName,
            lastName,
            otherCareIssuingAuthority,
            otherCareIssuingDate,
            phoneNumber,
            profilePic,
            region,
            state,
            zipCode,
            distance,
          };
        })
      );
      res.status(200).json({ data: formattedServices });
    } catch (err) {
      next(err);
    }
  },
  getAppointmentSlots: async (req, res, next) => {
    try {
      const { otherCareId, startDate, endDate } = req.params;

      // Parse the start and end dates into JavaScript Date objects
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      const daysBetweenDates = [];
      let currentDate = new Date(startDateTime);
      while (currentDate <= endDateTime) {
        const dayOfWeek = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        daysBetweenDates.push(dayOfWeek);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // getting timeslotes using specific otherCareId
      const getTimesSlots = await servicesTimeSlotsArray
        .find({
          otherCareId,
        })
        .lean()
        .exec();

      if (getTimesSlots && getTimesSlots.length > 0) {
        const timeSlots = getTimesSlots[0].timeSlots;
        const matchingTimeSlots = timeSlots.filter(
          (slot) =>
            daysBetweenDates.includes(slot.buisnessDay) && !slot.isClosed
        );

        const halfHourTimeSlots = matchingTimeSlots.map((slot) => {
          const startTime = slot.startTime;
          const endTime = slot.endTime;
          const halfHourSlots = generateHalfHourSlots(
            startTime,
            endTime,
            startDate
          );
          return {
            halfHourSlots,
          };
        });

        res.status(200).json(halfHourTimeSlots[0]);
      } else {
        res.status(404).json({ message: "No matching timeslots found." });
      }
    } catch (err) {
      next(err);
    }
  },
};


function convertTimeToDate(time) {
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hour, 10));
  date.setMinutes(parseInt(minute, 10));
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function generateHalfHourSlots(startTime, endTime, startDate) {
  const halfHourSlots = [];
  let currentTime = convertTimeToDate(startTime);
  const endTimeObj = convertTimeToDate(endTime);
  let count = 0;

  while (currentTime < endTimeObj) {
    const slotEnd = new Date(currentTime);
    slotEnd.setMinutes(currentTime.getMinutes() + 30);

    // Convert slotBegin and slotEnd to local time
    const slotBeginLocal = convertToLocaleDate(startDate, currentTime);
    const slotEndLocal = convertToLocaleDate(startDate, slotEnd);

    halfHourSlots.push({
      slotBegin: slotBeginLocal,
      slotEnd: slotEndLocal,
      slot: count + 1,
    });

    currentTime.setMinutes(currentTime.getMinutes() + 30);
    ++count;
  }

  return halfHourSlots;
}

// Helper function to convert time to Date object with the provided startDate
function convertToLocaleDate(startDate, time) {
  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateTime = new Date(`${startDate} ${timeString}`);
  const formattedDateTime = dateTime.toISOString();
  const standardTimeDate = new Date(formattedDateTime);
  const timeZoneOffsetMinutes = standardTimeDate.getTimezoneOffset();

  // Convert the time zone offset to milliseconds
  const timeZoneOffsetMilliseconds = timeZoneOffsetMinutes * 60 * 1000;

  // Calculate the local time in milliseconds
  const localTimeMilliseconds =
    standardTimeDate.getTime() - timeZoneOffsetMilliseconds;

  // Create a new Date object for the local time
  return new Date(localTimeMilliseconds);
}

// function convertTimeToDate(time) {
//   const [hour, minute] = time.split(":");
//   const date = new Date();
//   date.setHours(parseInt(hour, 10));
//   date.setMinutes(parseInt(minute, 10));
//   date.setSeconds(0);
//   date.setMilliseconds(0);
//   return date;
// }

// function generateHalfHourSlots(startTime, endTime, startDate) {
//   const halfHourSlots = [];
//   let currentTime = convertTimeToDate(startTime);
//   const endTimeObj = convertTimeToDate(endTime);
//   let count = 0;

//   while (currentTime < endTimeObj) {
//     const slotEnd = new Date(currentTime);
//     slotEnd.setMinutes(currentTime.getMinutes() + 30);

//     // Convert slotBegin and slotEnd to local time
//     const slotBeginLocal = convertToLocaleDate(startDate, currentTime);
//     const slotEndLocal = convertToLocaleDate(startDate, slotEnd);

//     halfHourSlots.push({
//       slotBegin: slotBeginLocal,
//       slotEnd: slotEndLocal,
//       slot: count + 1,
//     });

//     currentTime.setMinutes(currentTime.getMinutes() + 30);
//     ++count;
//   }

//   return halfHourSlots;
// }

// // Helper function to convert time to Date object with the provided startDate
// function convertToLocaleDate(startDate, time) {
//   const timeString = time.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const dateTime = new Date(`${startDate} ${timeString}`);
//   const formattedDateTime = dateTime.toISOString();
//   const standardTimeDate = new Date(formattedDateTime);
//   const timeZoneOffsetMinutes = standardTimeDate.getTimezoneOffset();

//   // Convert the time zone offset to milliseconds
//   const timeZoneOffsetMilliseconds = timeZoneOffsetMinutes * 60 * 1000;

//   // Calculate the local time in milliseconds
//   const localTimeMilliseconds =
//     standardTimeDate.getTime() - timeZoneOffsetMilliseconds;

//   // Create a new Date object for the local time
//   return new Date(localTimeMilliseconds);
// }

// function generateHalfHourSlots(startTime, endTime, startDate) {
//   const halfHourSlots = [];
//   let currentTime = convertTimeToDate(startTime);
//   const endTimeObj = convertTimeToDate(endTime);
//   let count = 0;

//   while (currentTime < endTimeObj) {
//     const slotEnd = new Date(currentTime);
//     slotEnd.setMinutes(currentTime.getMinutes() + 30);

//     const currentTime1 = currentTime.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     const dateTime = new Date(`${startDate} ${currentTime1}`);
//     const formattedDateTime = dateTime.toISOString();
//     const standardTimeDate = new Date(formattedDateTime);
//     const timeZoneOffsetMinutes = standardTimeDate.getTimezoneOffset();

//     // Convert the time zone offset to milliseconds
//     const timeZoneOffsetMilliseconds = timeZoneOffsetMinutes * 60 * 1000;

//     // Calculate the local time in milliseconds
//     const localTimeMilliseconds = standardTimeDate.getTime() - timeZoneOffsetMilliseconds;

//     // Create a new Date object for the local time
//     const localTimeDate = new Date(localTimeMilliseconds);

// //for slote end

//     const slotEnd1 = slotEnd.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//     console.log(slotEnd1)
//     const dateTime1 = new Date(`${startDate} ${slotEnd1}`);
//     const formattedDateTime1 = dateTime1.toISOString();
//     const standardTimeDate1 = new Date(formattedDateTime1);
//     const timeZoneOffsetMinutes1 = standardTimeDate1.getTimezoneOffset();

//     // Convert the time zone offset to milliseconds
//     const timeZoneOffsetMilliseconds1 = timeZoneOffsetMinutes1 * 60 * 1000;

//     // Calculate the local time in milliseconds
//     const localTimeMilliseconds1 = standardTimeDate.getTime() - timeZoneOffsetMilliseconds1;

//     // Create a new Date object for the local time
//     const localTimeDate1 = new Date(localTimeMilliseconds1);

//     halfHourSlots.push({
//       slotbegin: localTimeDate,
//       slotend: localTimeDate1,
//       slot: count + 1,
//     });
//     currentTime.setMinutes(currentTime.getMinutes() + 30);
//     ++count;
//   }
//   return halfHourSlots;
// }

// function generateHalfHourSlots(startTime, endTime,startDate) {
//   const halfHourSlots = [];
//   let currentTime = convertTimeToDate(startTime);
//   const endTimeObj = convertTimeToDate(endTime);
//   let count = 0;

//   while (currentTime < endTimeObj) {
//     const slotEnd = new Date(currentTime);
//     slotEnd.setMinutes(currentTime.getMinutes() + 30);
//     const currentTime1 = currentTime.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     halfHourSlots.push({
//       //concatenate start date parameter with currentTime
//       slotbegin:`${startDate} ${currentTime1}`,
//       slotend: slotEnd.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       slot: count + 1,
//     });
//     currentTime.setMinutes(currentTime.getMinutes() + 30);
//     ++count;
//   }
//   return halfHourSlots;
// }

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance;
};

module.exports = serviceClt;
