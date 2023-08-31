const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    amount: {
      type:Number
    },
    discount: {
      type:Number
    },
    category: {
      type:String
    },
    leadsId: {
      type:String
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patApplyService",
    },
    corporateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corporate",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("FaciltyInvoice", invoiceSchema);

module.exports = Invoice;
