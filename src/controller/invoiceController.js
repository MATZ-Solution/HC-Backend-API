const express = require('express');
const Invoice = require('../Model/invoiceModel');
const fnpaccounts = require('../Model/corporateModel');
const patdetails = require('../Model/patApplyService');
const axios = require('axios');

//========Get all invoices=============

const getInvoice = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();
    const fnpaccountIds = invoices.map((invoice) => invoice.corporateId);
    const pataccountIds = invoices.map((invoice) => invoice.patientId);

    const foundAccounts = await fnpaccounts.find({
      _id: { $in: fnpaccountIds },
    });
    const foundPatients = await patdetails.find({
      _id: { $in: pataccountIds },
    });

    const combinedData = invoices.map((invoice) => {
      const relatedAccount = foundAccounts.find(
        (account) => account._id.toString() === invoice.corporateId.toString()
      );
      const relatedPatient = foundPatients.find(
        (patient) => patient._id.toString() === invoice.patientId.toString()
      );

      return {
        ...invoice._doc, // Spread all properties of the invoice into the resulting object
        corporateAccount: relatedAccount._doc, // Nest the corporateAccount details under its own property
        patientDetails: relatedPatient._doc, // Nest the patientDetails under its own property
      };
    });

    res.status(200).json(combinedData);
  } catch (err) {
    console.error(err); // Log the detailed error to console
    res.status(500).json({ error: 'An error occurred fetching the invoices.' });
  }
};

module.exports = { getInvoice };
