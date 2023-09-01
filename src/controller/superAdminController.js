const patApplyService = require("../Model/patApplyService");
const corporate = require("../Model/corporateModel");
const invoice = require("../Model/invoiceModel");

const superAdminClt = {
    getInvoices: async (req, res, next) => {
        try {
            const getAllInvoices = await invoice.find().populate("patientId").populate("corporateId");
            if (getAllInvoices) {
                res.status(200).json(getAllInvoices)
            }
            res.status(200).json("Not Found")


        } catch (err) {
            next(err);
        }
    },
};



module.exports = superAdminClt;
