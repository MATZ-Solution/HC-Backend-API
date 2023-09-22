const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/ErrorHandler');
const patientApplyService = require('../Model/patApplyService');
const Corporate = require('../Model/corporateModel');
const invoice = require('../Model/invoiceModel');
const calculateTotalAmount = require('../utils/calculateTotalAmount');

const emailController = async (req, res, next) => {
  try {
    const { to, subject, body, corporateNum } = req.body;
    const emailOptions = {
      to,
      subject,
      text: body,
    };

    // Await the database update operation
    const updateCounter = await patientApplyService.findOneAndUpdate(
      { patEmail: to, servicePhoneNumber: corporateNum },
      { $inc: { corporateContacted: 1 } },
      { new: true }
    );

    // Send the email
    await sendEmail({ ...emailOptions, res });

    // Return a success response or perform other actions
    res.status(200).json({
      success: true,
      message: 'Email sent and counter updated successfully',
      updateCounter,
    });
  } catch (err) {
    // Handle errors using the ErrorHandler
    next(err);
  }
};

const updateCorporate = async (req, res, next) => {
  try {
    const { mongoDbId } = req.body;

    const updatedCorporate = await Corporate.findByIdAndUpdate(
      { _id: mongoDbId },
      { ...req.body },
      { new: true }
    );

    if (updatedCorporate) {
      res.status(200).json(updatedCorporate);
    } else {
      res.status(404).json({ message: 'Not Found' });
    }
  } catch (err) {
    next(err);
  }
};

//for complain add by scraped complain by user

const addComplainId = async (req, res, next) => {
  try {
    const { phoneNumber, mongoDbID, category } = req.body;

    const corporate = await Corporate.findOne({
      organizationContactNo: phoneNumber,
    });

    if (!corporate) {
      return res.status(404).json({ message: 'Corporate not found' });
    }

    // Check if the same MongoDB ID already exists in the complaintIds array
    const existingComplaint = corporate.complaintIds.find(
      (complaint) => complaint.mongoDbID === mongoDbID
    );
    if (existingComplaint) {
      return res
        .status(200)
        .json({ message: 'Complaint ID already exists in the array' });
    }

    // If the complaint doesn't exist, add it to the complaintIds array
    corporate.complaintIds.push({ mongoDbID, category });
    await corporate.save();

    res
      .status(200)
      .json({ success: true, message: 'Complaint ID added successfully' });
  } catch (err) {
    next(err);
  }
};

//corporate getting his invidual invoices

const getIndividualInvoice = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const getAllInvoices = await invoice
      .find({ corporateId: _id })
      .populate('patientId');

    if (getAllInvoices && getAllInvoices.length > 0) {
      const formattedInvoices = getAllInvoices.map((invoice) => ({
        _id: invoice._id,
        leadAmount: invoice.leadAmount,
        discount: invoice.discount,
        subTotal: invoice.subTotal,
        grandTotal: invoice.grandTotal,
        dueDate: invoice.dueDate,
        isPayNow: invoice.isPayNow,
        additionalMessage: invoice.additionalMessage,
        category: invoice.category,
        leadsId: invoice.leadsId,
        patFullName: invoice.patientId.patFullName,
        patAddress: invoice.patientId.patAddress,
        patEmail: invoice.patientId.patEmail,
        patPhoneNumber: invoice.patientId.patPhoneNumber,
        patDescription: invoice.patientId.patDescription,
        category: invoice.patientId.category,
        scrapeMongoDbID: invoice.patientId.scrapeMongoDbID,
        serviceCategory: invoice.patientId.serviceCategory,
        serviceCity: invoice.patientId.serviceCity,
        servicePhoneNumber: invoice.patientId.servicePhoneNumber,
        serviceFullAddress: invoice.patientId.serviceFullAddress,
        serviceZipCode: invoice.patientId.serviceZipCode,
        serviceState: invoice.patientId.serviceState,
        serviceLatitude: invoice.patientId.serviceLatitude,
        serviceLongitude: invoice.patientId.serviceLongitude,
        serviceOverAllRating: invoice.patientId.serviceOverAllRating,
        servicePatientSurveyRating:
          invoice.patientId.servicePatientSurveyRating,
        servicePatientSurveyRating:
          invoice.patientId.servicePatientSurveyRating,
      }));

      res.status(200).json(formattedInvoices);
    } else {
      res.status(404).json('Not Found');
    }
  } catch (err) {
    next(err);
  }
};

const getIndividualInvoiceCount = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const getAllInvoices = await invoice.find({ corporateId: _id });
    const counts = getAllInvoices.reduce(
      (accumulator, invoice) => {
        switch (invoice.payStatus) {
          case 'paid':
            accumulator.paid++;
            break;
          case 'partiallyPaid':
            accumulator.partiallyPaid++;
            break;
          case 'unPaid':
            accumulator.unpaid++;
            break;
          default:
            break;
        }
        return accumulator;
      },
      { paid: 0, partiallyPaid: 0, unpaid: 0 }
    );

    res.status(200).json(counts);
  } catch (error) {
    next(error);
  }
};

const getRecordsOnPayStatus = async (req, res, next) => {
  const { _id } = req.user;

  const records = await invoice
    .find({
      corporateId: _id,
      payStatus: req.params.payStatus,
    })
    .populate('patientId');

  !records || records.length === 0
    ? res.status(404).json({ message: 'No records found.' })
    : res.status(200).json(records);
};

const payFacilityInvoice = async (req, res, next) => {
  try {
    const invoiceId = req.params.invoiceId;
    const { paymentAmount, attachement } = req.body; // Assuming you receive the payment amount in the request body

    //find the invoice by id
    const foundInvoice = await invoice.findById(invoiceId);

    if (!foundInvoice) {
      return res
        .status(404)
        .json({ success: false, message: 'Invoice not found' });
    }

    const totalAmount = calculateTotalAmount(foundInvoice);

    console.log(foundInvoice.isButtonClicked)
  

    if (!foundInvoice.isButtonClicked) {
      console.log("not run");
      if (paymentAmount > 0) {
        foundInvoice.payStatus =
          paymentAmount === totalAmount ? 'paid' : 'partiallyPaid';

        foundInvoice.balance =
          paymentAmount === totalAmount ? 0 : totalAmount - paymentAmount;

        foundInvoice.leadAmount = paymentAmount
          ? foundInvoice.leadAmount - paymentAmount
          : foundInvoice.leadAmount;

        foundInvoice.subTotal = paymentAmount
          ? foundInvoice.subTotal - paymentAmount
          : foundInvoice.subTotal;

        foundInvoice.grandTotal = paymentAmount
          ? foundInvoice.grandTotal - paymentAmount
          : foundInvoice.grandTotal;

        //   foundInvoice.discount = paymentAmount ? 0 : foundInvoice.discount;
        foundInvoice.attachement = attachement ? attachement : '';
        
        // change status to true on button clicked
        foundInvoice.isButtonClicked = true
        //save invoice
        await foundInvoice.save();

      } else {
        throw new ErrorHandler('Amount Should be Greater than 0', 200);
      }
    } else {
      res.status(200).json('Already Paid');
    }

    //return response
    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      foundInvoice,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  emailController,
  updateCorporate,
  addComplainId,
  getIndividualInvoice,
  payFacilityInvoice,
  getIndividualInvoiceCount,
  getRecordsOnPayStatus,
};
