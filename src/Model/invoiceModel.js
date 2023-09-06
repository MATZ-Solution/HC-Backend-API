const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    leadAmount: {
      type: Number
    },
    subTotal: {
      type: Number
    },
    grandTotal: {
      type: Number
    },
    discount: {
      type: Number
    },
    dueDate: {
      type: String
    },
    category: {
      type: String
    },
    additionalMessage: {
      type: String
    },
    leadsId: {
      type: String
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patApplyService",
    },
    corporateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "facilityOwnerAndProfessional",
    },
    isPayNow: {
      type: Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const Invoice = mongoose.model("FaciltyInvoice", invoiceSchema);

module.exports = Invoice;
