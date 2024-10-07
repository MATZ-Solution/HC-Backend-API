const patApplyService = require('../Model/patApplyService');
const corporate = require('../Model/corporateModel');
const invoice = require('../Model/invoiceModel');
const reviewModel = require('../Model/reviewModel');
const facilityOtp = require('../Model/facilityOtp');
const patService = require('../Model/patApplyService');
const { default: axios } = require('axios');
const User = require('../Model/User');
const ErrorHandler = require('../utils/ErrorHandler');
const EmailSender = require('../utils/email');
const webReviewModel = require('../Model/webReviewModel');
const notificationModel = require('../Model/notificationModel');
const FacilityRequest = require('../Model/facilityRequestModel');
const UpdateFacilityRequest = require('../Model/updateFacilityRequest');
const sendEmail = require('../utils/email');
const sendEmailForFacility = require('../utils/sendEmailForFacility');

const superAdminClt = {
  //Reject Patient Services By SuperAdmin

  rejectPatServiceBySuperAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;

      const patServices = await patService.findByIdAndUpdate(
        { _id: id },
        { isRejected: true },
        { new: true }
      );

      const emailOptions = {
        to: patServices.patEmail,
        subject: 'Important: Your Health Service Request Update',
        html: `
          <p>Dear ${patServices.patFullName},</p>
      
          <p>
            We appreciate your interest in our health services. We regret to inform you that after careful consideration, your health service request for ${patServices.serviceName} has been declined by our team.
          </p>
      
          <p>
            Facility Details:<br />
            Name: ${patServices.serviceName}<br />
            City: ${patServices.serviceCity}<br />
            Address: ${patServices.serviceFullAddress}<br />
            Zip Code: ${patServices.serviceZipCode}<br />
            State: ${patServices.serviceState}
          </p>
      
          <p>
            We understand that this decision may be disappointing, and we want to assure you that we value your interest. If you have any further questions or would like to discuss this decision, please do not hesitate to reach out to our customer support team. We are here to assist you in any way we can.
          </p>
      
          <p>
            Your well-being and satisfaction are important to us, and we appreciate your understanding. Thank you for considering our health services.
          </p>
      
          <p>
            Sincerely,<br />
          </p>
      
          <img
            src="https://healthcare-assets.s3.amazonaws.com/final+logo.jpg"
            alt="Company Logo" width="150" height="150"
          />
        `,
      };

      await EmailSender(emailOptions);

      res.status(200).json('Request Declined');
    } catch (err) {
      next(err);
    }
  },
  getInvoices: async (req, res, next) => {
    try {
      const getAllInvoices = await invoice
        .find()
        .populate('patientId')
        .populate('corporateId');
      if (getAllInvoices) {
        res.status(200).json(getAllInvoices);
      }
      res.status(200).json('Not Found');
    } catch (err) {
      next(err);
    }
  },
  addReview: async (req, res, next) => {
    try {
      const { mongoDbID, category, name, email, reviews, startRating } =
        req.body;

      const createReview = new reviewModel({
        mongoDbID,
        category,
        name,
        email,
        reviews,
        startRating,
      });
      const notification=await notificationModel.create({
        email:email,
        message:`Review submitted for  ${req.body?.serviceName} successfully `,
        mongoDbID:mongoDbID
      })

      const savedRecord = await createReview.save();
      res.status(201).json(savedRecord);
    } catch (error) {
      next(error);
    }
  },
  getReviews: async (req, res, next) => {
    try {

  
      // const apiUrl =
      //   'http://hc-scrapted-data.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/healthCareRoute/getCorporatesUsingMongoId';

      // console.log("res")
      const apiUrl = process.env.apiUrl;
      console.log(apiUrl,"url")
      const getReviews = await reviewModel.find();
      // console.log(getReviews.length,"getReviews")
      const scraped = [];

      const scrapedResponses = await Promise.all(
        getReviews.map(async (review) => {
          const scrapedResponse = await axios.post(apiUrl, {
            mongoDbID: review.mongoDbID,
            category: review.category,
          });
          // review.scraped = scrapedResponse.data.name;
          // return review;
          // scraped.push({ scraped: scrapedResponse.data.name, review });
          return { scraped: scrapedResponse.data, review };
        })
      );
      // console.log(scrapedResponses,"scrapedResponses")
      const modifyResponse = scrapedResponses.map((review) => ({
        serviceName: review.scraped,
        isReviewApproved: review.review.isReviewApproved,
        _id: review.review._id,
        mongoDbID: review.review.mongoDbID,
        category: review.review.category,
        name: review.review.name,
        email: review.review.email,
        reviews: review.review.reviews,
        startRating: review.review.startRating,
        isReviewRejected: review.review.isReviewRejected,
        createdAt: review.review.createdAt,
        updatedAt: review.review.updatedAt,
      }));

      res.status(200).json(modifyResponse);
    } catch (error) {
      // console.log(error,"errrrrrrrrrrrr")
      next(error);
    }
  },
  rejectReviews: async (req, res, next) => {
    try {
      const { reviewMongoId } = req.body;

      const getReviews = await reviewModel.findOneAndUpdate(
        { _id: reviewMongoId },
        { isReviewRejected: true }
      );

      res.status(200).json(getReviews);
    } catch (error) {
      next(error);
    }
  },
  approvedReviews: async (req, res, next) => {
    try {
      const { _id, mongoDbID, category, name, email, reviews, startRating } =
        req.body;

      // const apiUrl =
      //   'http://hc-scrapted-data.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/healthCareRoute/approveReview';

      const apiUrl = process.env.approveReview;

      // Update the review status in the local database
      const updatedReview = await reviewModel.findOneAndUpdate(
        { _id: _id },
        { isReviewApproved: true }
      );

      // Send a request to the external API to approve the review
      const scrapedResponse = await axios.put(apiUrl, {
        mongoDbID: mongoDbID,
        category: category,
        name: name,
        email: email,
        reviews,
        startRating,
      });

      res.status(200).json(updatedReview);
    } catch (error) {
      next(error);
    }
  },
  getInvoiceCount: async (req, res, next) => {
    try {
      const getAllInvoices = await invoice.find();
      const counts = getAllInvoices.reduce(
        (accumulator, invoice) => {
          accumulator[invoice.payStatus.toLowerCase()]++;
          accumulator.total++;
          return accumulator;
        },
        { paid: 0, partiallypaid: 0, unpaid: 0, total: 0 }
      );

      res.status(200).json(counts);
    } catch (error) {
      next(error);
    }
  },
  getRecordsOnPayStatus: async (req, res, next) => {
    if (req.params.payStatus == 'total') {
      const records = await invoice
        .find()
        .populate('patientId')
        .populate('corporateId');
      res.status(200).json(records);
    } else {
      const records = await invoice
        .find({
          payStatus: req.params.payStatus,
        })
        .populate('patientId')
        .populate('corporateId');

      res.status(200).json(records);
    }
  },
  deletePatBySuperAdmin: async (req, res, next) => {
    try {
      const { role, _id } = req.body;
      let data;

      if (role === 'patient') {
        data = await User.deleteOne({ _id }, { new: true });
        res.status(200).json({
          message: 'User deleted successfully',
          data,
        });
      } else if (role === 'corporate') {
        data = await Promise.all([
          corporate.deleteOne({ _id }, { new: true }),
          facilityOtp.deleteOne({ corporateId: _id }),
          invoice.deleteMany({ corporateId: _id }),
        ]);

        res.status(200).json({
          message: 'Corporate record and related data deleted successfully',
          data,
        });
      } else {
        throw new ErrorHandler('Invalid Role Specified', 400);
      }
    } catch (err) {
      next(err);
    }
  },
  getRejectedInvoice: async (req, res, next) => {
    try {
      const rejectedInvoice = await invoice.find({ isRejected: true });
      res.status(200).json(rejectedInvoice);
    } catch (error) {
      next(error);
    }
  },
  approvedDisplayComment: async (req, res, next) => {
    try {
      const reviewId = req.params.id;
      const { isToDisplay, isCommentApproved } = req.body;
      // console.log(isToDisplay,"display")
  
      let updateFields = {};
  
      if (isToDisplay ==true || isToDisplay== false) {
          updateFields.isToDisplay = isToDisplay;
      }
  
      if (isCommentApproved ==="Accepted" || isCommentApproved ==="Rejected") {
          updateFields.isCommentApproved = isCommentApproved;
      }
  
      // Update the review based on the provided ID
      const updatedReview = await webReviewModel.findByIdAndUpdate(
          reviewId,
          updateFields,
          { new: true }
      );
  
      // if (!updatedReview) {
      //     return res.status(404).json({
      //         success: false,
      //         message: "Review not found",
      //     });
      // }
  
      
      const successMessage = isToDisplay
          ? "Update Display Comment successfully"
          : "Update Approve Reviews successfully";
  
      res.status(201).json({
          success: true,
          message: successMessage,
      });
  } catch (error) {
      // If an error occurs, pass it to the next middleware
      next(error);
  }
  
  
},

getallWebReviews:async(req,res,next)=>{
  try{
    const displayReviews = await webReviewModel.find();

        
       res.status(200).json(displayReviews)
    }
  catch(error){
    next(error)
  }
},
submitFacility:async(req,res,next)=>{
  try{
    const {name,email,facility_name,category,city,state,zip,address}=req.body
    console.log(req.body,'dssf')
    const facilityRequest = new FacilityRequest({
      name: name,
      email: email,
      facility_name: facility_name,
      category: category,
      city: city,
      state: state,
      zip: zip,
      address: address,
    });
    const savedFacilityRequest = await facilityRequest.save();
    await sendEmail({
      to: email,
      subject: 'Facility Request Submitted',
      text: 'Your facility request has been submitted successfully.',
      html: `
        <p>Dear ${name},</p>
        <p>Your facility request has been submitted successfully. Our team will review your request and get back to you soon.</p>
        <p>Thank you for choosing our platform.</p>
        <p>Best Regards,</p>
        <p>Info Senior Care Team</p>
      `,
    })
    res.status(201).json(savedFacilityRequest);
  }
  catch(error){
    console.log(error)
    next(error)
  }
},
submitFacilityUpdate:async(req,res,next)=>{
  try{
    const {name,email,update,category,mongoDbID}=req.body
    console.log(req.body,'dssf')
    const facilityRequest = new UpdateFacilityRequest({
      name: name,
      email: email,
      update: update,
      category: category,
      mongoDbID: mongoDbID,
    });
    const savedFacilityRequest = await facilityRequest.save();
    await sendEmail({
      to: email,
      subject: 'Facility Update Request Submitted',
      text: 'Your facility update request has been submitted successfully.',
      html: `
        <p>Dear ${name},</p>
        <p>Your facility update request has been submitted successfully. Our team will review your request and get back to you soon.</p>
        <p>Thank you for choosing our platform.</p>
        <p>Best Regards,</p>
        <p>Info Senior Care Team</p>
      `,
    });
    res.status(201).json(savedFacilityRequest);
  }
  catch(error){
    console.log(error)
    next(error)
  }
},
getUpdateFacility: async (req, res, next) => {
  try {
    const UpdateFacRequest = await UpdateFacilityRequest.find();
    
  

    const apiUrl = process.env.apiUrl;

    const scrapedResponses = [];

    for (const facility of UpdateFacRequest) {
      const { mongoDbID, category,_id ,name,email,update} = facility;
      console.log(mongoDbID, category,_id)

      
      const scrapedResponse = await axios.post(apiUrl, {
        mongoDbID,
        category,
      });
      

      scrapedResponses.push({
        _id,
        name:name,
        facility_name: scrapedResponse.data.name,
        category:category,
        email:email,
        update:update
      });
    }

    
    res.status(200).json({
      scrapedResponses,
    });
  } catch (error) {
    
    next(error);
  }
},
getFacility: async (req, res, next) => {
  try {
    const facilityRequest = await FacilityRequest.find();
    res.status(200).json(facilityRequest);
  } catch (error) {
    next(error);
  }
}


};

module.exports = superAdminClt;
