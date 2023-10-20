const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/ErrorHandler');
const patientApplyService = require('../Model/patApplyService');
const Corporate = require('../Model/corporateModel');
const invoice = require('../Model/invoiceModel');
// const calculatefoundInvoice = require('../utils/calculatefoundInvoice.payableAmount');

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

const rejectInvoiceByCorporate = async (req, res, next) => {
  try {
    const { id } = req.body;

    const rejectedInvoice = await invoice
      .findByIdAndUpdate(
        { _id: id },
        { isRejected: true },
        {
          new: true,
        }
      )
      .populate('patientId')
      .populate('corporateId');

    const emailOptions = {
      to: rejectedInvoice.patientId.patEmail,
      subject: 'Important: Your Health Service Request Update',
      html: `
        <p>Dear ${rejectedInvoice.patientId.patFullName},</p>

        <p>
          We appreciate your interest in our health services. We regret to inform you that after careful consideration,
          your health service request for ${rejectedInvoice.corporateId.organizationName} has been declined 
          by our team.
        </p>
        
        <p>
        Facility Details:<br />
        Name: ${rejectedInvoice.corporateId.organizationName}<br />
        City: ${rejectedInvoice.corporateId.organizationCity}<br />
        Address: ${rejectedInvoice.corporateId.organizationMainOfficeAddress}<br />
        Zip Code: ${rejectedInvoice.corporateId.organizationZipCode}<br />
        State: ${rejectedInvoice.corporateId.organizationState}
        </p>
        
        <p>
          Your Request is Decliened By Facility Owner. You can check out other facilites.
          from <a href="https://healthcare.matzsolutions.com/senior_care.html">here</a>
        </p>

        <p>
        If you have any questions or require additional clarification regarding the rejection details, please feel free to contact our accounts payable department at BestHealthService@gmail.com.
         Our team is here to assist you throughout this process.
      </p>

      <p>
        We appreciate your understanding and cooperation in this matter. Thank you for your continued partnership with Best Health Service.
         We look forward to resolving these issues promptly and continuing our positive collaboration.
      </p>
        <p>
          Sincerely,<br />
          Best Health Service
        </p>

        <img
          src="https://healthcare-assets.s3.amazonaws.com/final+logo.jpg"
          alt="Company Logo" width="150" height="150"
        />
      `,
    };

    await sendEmail(emailOptions);

    res.status(200).json('Request Declined');
  } catch (err) {
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
        grandTotal: invoice.payableAmount,
        dueDate: invoice.dueDate,
        isPayNow: invoice.isPayNow,
        additionalMessage: invoice.additionalMessage,
        patId: invoice.patientId._id,
        category: invoice.category,
        leadsId: invoice.leadsId,
        patFullName: invoice.patientId.patFullName,
        patAddress: invoice.patientId.patAddress,
        patEmail: invoice.patientId.patEmail,
        patPhoneNumber: invoice.patientId.patPhoneNumber,
        patDescription: invoice.patientId.patDescription,
        category: invoice.patientId.category,
        serviceName: invoice.patientId.serviceName,
        scrapeMongoDbID: invoice.patientId.scrapeMongoDbID,
        serviceCategory: invoice.patientId.serviceCategory,
        mainCategory: invoice.patientId.mainCategory,
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
        isButtonClicked: invoice.isButtonClicked,
        inoviceId: invoice.invoiceId,
        payStatus: invoice.payStatus,
      }));

      res.status(200).json(formattedInvoices);
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Invoice not found' });
    }
  } catch (err) {
    next(err);
  }
};

const getIndividualInvoiceCount = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const getAllInvoices = await invoice.find({ corporateId: _id });
    // const counts = getAllInvoices.reduce(
    //   (accumulator, invoice) => {
    //     accumulator[invoice.payStatus.toLowerCase()]++;
    //     accumulator.total++;
    //     return accumulator;
    //   },
    //   { paid: 0, partiallypaid: 0, unpaid: 0, total: 0 }
    // );

    const counts = getAllInvoices.reduce(
      (accumulator, invoice) => {
        accumulator[invoice.payStatus.toLowerCase()]++;
        if (invoice.isRejected) {
          accumulator.rejected++;
        }
        accumulator.total++;
        return accumulator;
      },
      { paid: 0, partiallypaid: 0, unpaid: 0, total: 0, rejected: 0 }
    );
    res.status(200).json(counts);
  } catch (error) {
    next(error);
  }
};

const getRecordsOnPayStatus = async (req, res, next) => {
  const { _id } = req.user;

  if (req.params.payStatus == 'total') {
    const records = await invoice
      .find({ corporateId: _id })
      .populate('patientId')
      .populate('corporateId');
    // res.status(200).json({ success: true, data: records });
    res.status(200).json(records);
  } else if (req.params.payStatus == 'rejected') {
    const records = await invoice
      .find({ corporateId: _id, isRejected: true })
      .populate('patientId')
      .populate('corporateId');
    // res.status(200).json({ success: true, data: records });
    res.status(200).json(records);
  } else {
    const records = await invoice
      .find({
        corporateId: _id,
        payStatus: req.params.payStatus,
      })
      .populate('patientId')
      .populate('corporateId');
    // res.status(200).json({ success: true, data: records });
    res.status(200).json(records);
  }
};

const payFacilityInvoice = async (req, res, next) => {
  try {
    const invoiceId = req.params.invoiceId; //getting invoice id from param
    const { paymentAmount, attachement } = req.body; // receive the payment amount in the request body

    //find the invoice by id

    const foundInvoice = await invoice.findById(invoiceId);

    //not found invoice send message Invoice not found
    if (!foundInvoice) {
      return res
        .status(404)
        .json({ success: false, message: 'Invoice not found' });
    }

    if (!foundInvoice.isButtonClicked) {
      if (paymentAmount > 0) {
        foundInvoice.payStatus =
          paymentAmount === foundInvoice.payableAmount
            ? 'paid'
            : 'partiallyPaid';

        //push the object into the paid amount array
        const newPayment = {
          date: new Date(),
          amount: paymentAmount,
          attachement: attachement ? attachement : '',
        };

        foundInvoice.paidAmount.push(newPayment);

        foundInvoice.dues =
          paymentAmount === foundInvoice.payableAmount
            ? 0
            : foundInvoice.payableAmount - paymentAmount;

        // foundInvoice.leadAmount = paymentAmount
        //   ? foundInvoice.leadAmount - paymentAmount
        //   : foundInvoice.leadAmount;

        // foundInvoice.subTotal = paymentAmount
        //   ? foundInvoice.subTotal - paymentAmount
        //   : foundInvoice.subTotal;

        // foundInvoice.payableAmount = paymentAmount
        //   ? foundInvoice.grandTotal - paymentAmount
        //   : foundInvoice.grandTotal;

        //   foundInvoice.discount = paymentAmount ? 0 : foundInvoice.discount;
        // foundInvoice.attachement = attachement ? attachement : '';

        // change status to true on button clicked
        foundInvoice.isButtonClicked = true;
        //save invoice
        await foundInvoice.save();

        //return response
        return res.status(200).json({
          success: true,
          message: 'Payment processed successfully',
          foundInvoice,
        });
      } else {
        throw new ErrorHandler('Amount Should be Greater than 0', 200);
      }
    } else {
      return res.status(404).json({ success: false, message: 'Already Paid' });
    }
  } catch (err) {
    next(err);
  }
};

const payPartiallyInvoice = async (req, res, next) => {
  try {
    const invoiceId = req.params.invoiceId; //getting invoice id from param
    const { paymentAmount, attachement } = req.body; // receive the payment amount in the request body

    //find the invoice by id
    const foundInvoice = await invoice.findById(invoiceId);

    //not found invoice send message Invoice not found
    if (!foundInvoice) {
      return res
        .status(404)
        .json({ success: false, message: 'Invoice not found' });
    }

    // const foundInvoice.payableAmount = calculatefoundInvoice.payableAmount(foundInvoice);

    if (foundInvoice.dues > 0) {
      if (paymentAmount > 0) {
        foundInvoice.payStatus =
          paymentAmount === foundInvoice.dues ? 'paid' : 'partiallyPaid';

        //push the object into the paid amount array
        const newPayment = {
          date: new Date(),
          amount: paymentAmount,
          attachement: attachement ? attachement : '',
        };

        foundInvoice.paidAmount.push(newPayment);

        foundInvoice.dues =
          paymentAmount === foundInvoice.dues
            ? 0
            : foundInvoice.dues - paymentAmount;

        // foundInvoice.leadAmount = paymentAmount
        //   ? foundInvoice.leadAmount - paymentAmount
        //   : foundInvoice.leadAmount;

        // foundInvoice.subTotal = paymentAmount
        //   ? foundInvoice.subTotal - paymentAmount
        //   : foundInvoice.subTotal;

        // foundInvoice.payableAmount = paymentAmount
        //   ? foundInvoice.payableAmount - paymentAmount
        //   : foundInvoice.payableAmount;

        //   foundInvoice.discount = paymentAmount ? 0 : foundInvoice.discount;
        // foundInvoice.attachement = attachement ? attachement : '';

        // change status to true on button clicked
        foundInvoice.isButtonClicked = true;
        //save invoice
        await foundInvoice.save();

        //return response
        return res.status(200).json({
          success: true,
          message: 'Payment processed successfully',
          foundInvoice,
        });
      } else {
        throw new ErrorHandler('Amount Should be Greater than 0', 200);
      }
    } else {
      res.status(200).json({
        success: false,
        message: 'Already Paid',
      });
    }
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
  payPartiallyInvoice,
  rejectInvoiceByCorporate,
};
