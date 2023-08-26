const mongoose = require('mongoose');

// Define the Branch schema
const branchSchema = new mongoose.Schema({
    branchName: { type: String },
    organizationName: { type: String},
    branchType: { type: String},
    branchAddress: { type: String},
    branchRegion: { type: String },
    branchState: { type: String},
    branchCity: { type: String},
    branchZipCode: { type: String},
    branchEmail: { type: String },
    branchContactNo: { type: String},
    branchWebsite: { type: String },
    branchLicenseNo: { type: String },
    facilitiesProvided: { type: [String] },
    professionalProvided: { type: [String] },
    yearsofExperience: { type: String },
    uploadLegalDoc: { type: String },
    uploadIncidentReport: { type: String },
    branchDetail: { type: String },
    branchLogo: { type: String },
    branchImages: { type: [String] },
    branchVideo: { type: String },
    videoTitle: { type: String },
    isApprovedbYSuperAdmin:{
        type:Boolean,
        default:false
    },
    branchManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BranchManager' },
    corporateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Corporate' }
});

// Create the Branch model
const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
