const mongoose = require('mongoose');
const payStatus = ['PAID', 'UNPAID', 'PARTIALLY-PAID'];

const invoiceSchema = mongoose.Schema(
  {
    leadAmount: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    balance: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: String,
    },
    category: {
      type: String,
    },
    additionalMessage: {
      type: String,
    },
    leadsId: {
      type: String,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patApplyService',
    },
    corporateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'facilityOwnerAndProfessional',
    },
    payStatus: {
      type: String,
      default: 'UNPAID',
      enum: payStatus,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model('FaciltyInvoice', invoiceSchema);

module.exports = Invoice;
