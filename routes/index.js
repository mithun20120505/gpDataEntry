const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const Survey = require('../models/Survey');
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Handle Excel file upload
router.post('/upload' , upload.single('file'), async (req, res) => {
  const file = XLSX.readFile(req.file.path);
  // Assuming the data is in the first sheet
      const sheetName = file.SheetNames[0];
      const worksheet = file.Sheets[sheetName];
      // Convert the sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("jsonData : "+ jsonData);
      if (jsonData.length === 0) {
          return res.status(400).send('The uploaded file is empty or not formatted correctly.');
      }
      jsonData.forEach(async (data) => {
        const newUser = new Survey({
          userName: data.userName,
          fatherHusbandName: data.fatherHusbandName,
          village: data.village,
          ward: data.ward,
          epicNumber: data.epicNumber === "" ? "NA" :data.epicNumber,
            rationDetails: {
                ration: data.ration === 'Yes' ? true : false,
                rationNo: data.rationNo === "" ? "NA" :data.rationNo,
                rationType: data.rationType === "" ? "NA" :data.rationType,
                activatedOn: data.activatedOn === "" ? "NA" :data.activatedOn,
            },
            healthDetails: {
                hasDisease: data.hasDisease === 'Yes' ? true : false,
                diseaseName: data.diseaseName === "" ? "NA" :data.diseaseName,
                diseaseDate: data.diseaseDate === "" ? "NA" :data.diseaseDate ,
                isHandicapped: data.isHandicapped === 'Yes' ? true : false,
                hasHealthCard: data.hasHealthCard === "" ? "NA" :data.hasHealthCard ,
                healthCardNo: data.healthCardNo === "" ? "NA" :data.healthCardNo,
            },
            ruralHouse: {
                hasHouse: data.hasHouse === 'Yes' ? true : false,
                houseType: data.houseType === "" ? "NA" :data.diseaseName,
                landless: data.landless === "" ? "NA" :data.landless,
                katchaPakkaGhar: data.katchaPakkaGhar === "" ? "NA" :data.katchaPakkaGhar,
            },
            carrer:{
              qualification: data.qualification === "" ? "NA" :data.qualification,
              course:data.course === "" ? "NA" :data.course,
              other:data.other === "" ? "NA" :data.other,
            },
            bplStatus: data.bplStatus === 'Yes' ? true : false,
            insuranceStatus: data.insuranceStatus === 'Yes' ? true : false,
            occupation: data.occupation === "" ? "NA" :data.occupation,
            aadhaarCardNo: data.aadhaarCardNo === "" ? "NA" :data.aadhaarCardNo,
            mobileNo: data.mobileNo === "" ? "NA" :data.mobileNo,
            street: data.street === "" ? "NA" :data.street,
            dob: data.dob === "" ? "NA" :data.dob,
            bankAccount: data.bankAccount === 'Yes' ? true : false,
            drinkingWater: data.drinkingWater === 'Yes' ? true : false,
            cowShed: data.cowShed === 'Yes' ? true : false,
            hasCow: data.hasCow === 'Yes' ? true : false
        });
        try {
          await newUser.save();
          //res.status(200).send('Data uploaded successfully!');
        } catch (e) {
          console.error(e);
          res.status(500).send('Error saving data to the database.');
        }

    });
res.status(200).json({ message: 'Data uploaded successfully' });
});
router.get('/dashboard',ensureAuthenticated, async (req, res) => {
const users = await Survey.find();
const user = await req.user;
console.log("user at users : "+ users);
console.log("user at req.users : "+ user);
res.render('dashboard', { users, user: user });
});
router.post('/update/:id', async (req, res) => {
  try {
        const updatedUser = await Survey.findByIdAndUpdate(req.params.id, {
            $set: {
              'userName': req.body.userName,
              'fatherHusbandName': req.body.fatherHusbandName,
              'village': req.body.village,
              'ward': req.body.ward,
              'house':req.body.houseNo,
              'family':req.body.familyNo,
              'epicNumber': req.body.epicNumber,
              'rationDetails.ration': req.body.ration === 'yes' ? true : false,
              'rationDetails.rationNo': req.body.rationNo,
              'rationDetails.rationType': req.body.rationType,
              'rationDetails.activatedOn': req.body.activatedOn,
              'healthDetails.hasDisease': req.body.hasDisease  === 'yes' ? true : false,
              'healthDetails.diseaseName': req.body.diseaseName,
              'healthDetails.diseaseDate': req.body.diseaseDate,
              'healthDetails.hasHealthCard': req.body.hasHealthCard === 'yes' ? true : false,
              'healthDetails.healthCardNo': req.body.healthCardNo,
              'ruralHouse.hasHouse': req.body.hasHouse  === 'yes' ? true : false,
              'ruralHouse.houseType': req.body.houseType,
              'ruralHouse.houseStatus': req.body.houseStatus,
              'ruralHouse.houseDate': req.body.houseDate,
              'carrer.qualification': req.body.qualification,
              'carrer.course':req.body.course,
              'carrer.other':req.body.other,
                'katchaPakkaGhar': req.body.katchaPakkaGhar,
                'isHandicapped': req.body.isHandicapped === 'yes' ? true : false,
                'bplStatus': req.body.bplStatus === 'yes' ? true : false,
                'insuranceStatus': req.body.insuranceStatus === 'yes' ? true : false,
                'occupation': req.body.occupation,
                'aadhaarCardNo': req.body.aadhaarCardNo,
                'mobileNo': req.body.mobileNo,
                'street': req.body.street,
                'dob': req.body.dob,
                'bankAccount': req.body.bankAccount === 'yes' ? true : false,
                'drinkingWater': req.body.drinkingWater === 'yes' ? true : false,
                'cowShed': req.body.cowShed === 'yes' ? true : false,
                'hasCow': req.body.hasCow === 'yes' ? true : false,
                'landless': req.body.landless === 'yes' ? true : false,
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.redirect('/dashboard');
        // res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Search functionality
router.post('/search', async (req, res) => {
  const searchQuery = req.body.searchQuery;
  const users = await Survey.find({ userName: { $regex: searchQuery, $options: 'i' } });
  res.render('dashboard', { users });
});
// Delete user route
router.get('/delete/:id', async (req, res) => {
  await Survey.findByIdAndDelete(req.params.id);
  const users = await Survey.find();
  res.render('dashboard', {users});
});
// Edit user route
router.get('/edit/:id', async (req, res) => {
  const users = await Survey.findById(req.params.id);
  console.log("user at edit : "+users);
  const user = await req.user;
  res.render('editUser', { users,user:user });
});
router.post('/submit', (req, res) => {
  console.log('Received data:', req.body);
  try {
    const newUser = new Survey({
      userName: req.body.userName,
      fatherHusbandName: req.body.fatherHusbandName,
      village: req.body.village,
      ward: req.body.ward,
      house:req.body.houseNo,
      family:req.body.familyNo,
      epicNumber: req.body.epicNumber,
      rationDetails: {
        ration: req.body.ration === 'yes',
        rationNo: req.body.rationNo,
        rationType: req.body.rationType,
        activatedOn: req.body.activatedOn,
      },
      healthDetails: {
        hasDisease: req.body.hasDisease === 'yes',
        diseaseName: req.body.diseaseName,
        diseaseDate: req.body.diseaseDate,
        isHandicapped: req.body.isHandicapped === 'yes',
        hasHealthCard: req.body.hasHealthCard === 'yes',
        healthCardNo: req.body.healthCardNo,
      },
      ruralHouse: {
        hasHouse: req.body.hasHouse === 'yes',
        houseType: req.body.houseType,
        landless: req.body.landless === 'yes',
        katchaPakkaGhar:req.body.katchaPakkaGhar,
      },
      carrer:{
        qualification: req.body.qualification,
        course:req.body.course,
        other:req.body.other,
      },
      bplStatus: req.body.bplStatus === 'yes',
      insuranceStatus: req.body.insuranceStatus === 'yes',
      occupation: req.body.occupation,
      aadhaarCardNo: req.body.aadhaarCardNo,
      mobileNo: req.body.mobileNo,
      street: req.body.street,
      dob: req.body.dob,
      bankAccount: req.body.bankAccount === 'yes',
      drinkingWater: req.body.drinkingWater === 'yes',
      cowShed: req.body.cowShed === 'yes',
      hasCow: req.body.hasCow === 'yes',
    });

    newUser.save().then(() => res.redirect('/dashboard'));
  } catch (e) {
    console.error('Error inserting data:', e);
        res.status(500).json({ message: 'Server error' });
  }

});
module.exports = router;
