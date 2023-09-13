const notiModel = require('../Model/notiHistoryModel');
const ErrorHandler = require('../utils/ErrorHandler');

const notiClt = {
  getNotificationHistory: async (req, res, next) => {
    try {
      //extract _id and isAdmin from token
      const { _id, isAdmin } = req.user;
      //create variable notiHistory globally
      let notiHistory;
      
        //if superAdmin return superAdmin notification history if condition match with corporate return corporate history
      if (isAdmin === 'super-admin') {
        notiHistory = await notiModel.find({ superAdminId: _id });
        res.status(200).json(notiHistory);
      } else if (isAdmin === 'corporate') {
        notiHistory = await notiModel.find({ corporateId: _id });
        res.status(200).json(notiHistory);
      }
    } catch (err) {
      next(err);
    }
  },
};
module.exports = notiClt;
