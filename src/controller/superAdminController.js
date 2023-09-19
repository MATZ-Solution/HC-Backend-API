const patApplyService = require('../Model/patApplyService');
const corporate = require('../Model/corporateModel');
const invoice = require('../Model/invoiceModel');
const reviewModel = require('../Model/reviewModel');
const { default: axios } = require('axios');

const superAdminClt = {
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
      const apiUrl =
        'http://hc-scrapted-data.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/healthCareRoute/getCorporatesUsingMongoId';

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

      const apiUrl =
        'http://hc-scrapted-data.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/healthCareRoute/approveReview';

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
};

module.exports = superAdminClt;
