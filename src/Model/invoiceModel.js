const mongoose = require('mongoose');
const payStatus = ['paid', 'unPaid', 'partiallyPaid'];

const invoiceSchema = mongoose.Schema(
  {
    leadAmount: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    payableAmount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    dues: {
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
      default: 'unPaid',
      enum: payStatus,
    },
    attachement: {
      type: String,
    },
    isButtonClicked: {
      type: Boolean,
      default: false,
    },
    paidAmount: [
      {
        date: {
          type: Date,
          default: Date.now(),
        },
        amount: {
          type: Number,
          default: 0,
        },
      },
    ],
    invoiceId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model('FaciltyInvoice', invoiceSchema);

module.exports = Invoice;
