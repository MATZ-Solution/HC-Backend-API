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

      // const emailOptions = {
      //   to: patServices.patEmail,
      //   subject: 'Your Health Service Request is Rejected',
      //   html: `
      //     <p>Dear ${patServices.patFullName},</p>

      //     <p>
      //       We are pleased to inform you that your health service request has
      //       been successfully received and forwarded to the ${patServices.serviceName}.
      //     </p>
      //     <p>
      //       Facility Details
      //       Name: ${patServices.serviceName}
      //       City: ${patServices.serviceCity}
      //       Address : ${patServices.serviceFullAddress}
      //       Zip Code : ${patServices.serviceZipCode}
      //       State : ${patServices.serviceState}
      //     </p>

      //     <p>
      //       The facility owner will be in touch with you as soon as possible
      //       to discuss your specific requirements and preferences. If you have
      //       any immediate questions or if there's anything specific you would
      //       like to share, please Contact Our Customer Support.
      //     </p>

      //     <p>
      //       Your well-being is our top priority, and our team is here to
      //       assist you.
      //     </p>

      //     <p>
      //       Thank you for choosing our health services. Your trust means the
      //       world to us.
      //     </p>

      //     <p>
      //       Warm regards,<br />
      //       Best Health Service Team
      //     </p>

      //     <img
      //       src="https://healthcare-assets.s3.amazonaws.com/final+logo.jpg"
      //       alt="Company Logo" width="150" height="150"
      //     />
      //   `,
      // };

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

      const apiUrl = process.env.apiUrl;

      const getReviews = await reviewModel.find();
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
          return { scraped: scrapedResponse.data.name, review };
        })
      );

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
};

module.exports = superAdminClt;
