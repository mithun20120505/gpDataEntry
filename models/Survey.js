const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  userName: String,
  fatherHusbandName: String,
  gender:String,
  village: String,
  ward: String,
  house:Number,
  family:Number,
  epicNumber: String,
  rationDetails: {
    ration:Boolean,
    rationNo: String,
    rationType: String, // State/Central
    activatedOn: Date,
  },
  healthDetails: {
    hasDisease: Boolean,
    diseaseName: String,
    diseaseDate: Date,
    isHandicapped: Boolean,
    hasHealthCard:Boolean,
    healthCardNo:String,
  },
  ruralHouse: {
    hasHouse: String,
    houseType: String,
    landless: Boolean,
    katchaPakkaGhar: String,
  },
  carrer:{
    qualification: String,
    course:String,
    other:String
  },
  bplStatus: Boolean,
  insuranceStatus: Boolean,
  occupation: String,
  aadhaarCardNo: String,
  mobileNo: String,
  street: String,
  dob: Date,
  bankAccount: Boolean,
  drinkingWater: Boolean,
  cowShed: Boolean,
  hasCow: Boolean
});

module.exports = mongoose.model('Survey', SurveySchema);
