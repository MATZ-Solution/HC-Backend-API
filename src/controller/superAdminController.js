const patApplyService = require('../Model/patApplyService');
const corporate = require('../Model/corporateModel');
const invoice = require('../Model/invoiceModel');
const reviewModel = require('../Model/reviewModel');

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
      const getReviews = await reviewModel.find();

      res.status(200).json(getReviews);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = superAdminClt;
