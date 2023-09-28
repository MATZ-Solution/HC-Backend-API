const noOfCallsMademodel = require('../Model/noOfCallsMade');
const ErrorHandler = require('../utils/ErrorHandler');

const noOfCallsMadeClt = {
  getCallsMade: async (req, res, next) => {
    try {
      const { _id, isAdmin } = req.user;
      let getCallsMade;
      isAdmin === 'corporate'
        ? (getCallsMade = await noOfCallsMademodel
            .find({ corporateId: _id })
            .populate('corporateId')
            .populate('patientId'))
        : isAdmin === 'super-admin'
        ? (getCallsMade = await noOfCallsMademodel
            .find()
            .populate('corporateId')
            .populate('patientId'))
        : '';

      res.status(200).json(getCallsMade);
    } catch (err) {
      next(err);
    }
  },
};
module.exports = noOfCallsMadeClt;
