const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const Survey = require('../models/Survey');
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const logger = require('../log/logger');
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
      var headers = [];
      const sheetName = file.SheetNames[0];
      const worksheet = file.Sheets[sheetName];
      var range = XLSX.utils.decode_range(worksheet['!ref']);
      var C, R = range.s.r;
      /* start in the first row */
      /* walk every column in the range */
      for (C = range.s.c; C <= range.e.c; ++C) {
          var cell = worksheet[XLSX.utils.encode_cell({c: C, r: R})];
          /* find the cell in the first row */

          var hdr = "UNKNOWN " + C; // <-- replace with your desired default
          if (cell && cell.t) {
              hdr = XLSX.utils.format_cell(cell);
          }
          headers.push(hdr);
      }
      // Convert the sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("jsonData : "+ jsonData);

      if (jsonData.length === 0) {
          return res.status(400).send('The uploaded file is empty or not formatted correctly.');
      }
      if (jsonData.length > 0) {
      jsonData.forEach(function (row) {
            // Set empty cell to ''.
            headers.forEach(function (hd) {
                if (row[hd] == undefined) {
                    row[hd] = '';
                }
            });
        });
      }
      try {
        jsonData.forEach(async (data) => {
          const newUser = new Survey({
            userName: data.userName == undefined || "" ? "" : data.userName.trim().toLowerCase(),
            fatherHusbandName: data.father == undefined || "" ? "" : data.father.trim().toLowerCase(),
            gender: data.gender == undefined || "" ? "" : data.gender.toLowerCase().trim() === "male" || "m" ? "1" : data.gender.toLowerCase() === "female" || "f" ? "2" : "",
            village: data.village == undefined || "" ? "" : data.village.toLowerCase().trim() === "inam dengapadar" || "dengapadar" || "dp" ? "1" : data.village.toLowerCase() === "hindal" || "hindol" || "hindola" ? "2" : data.village.toLowerCase() === "nandiagada" || "ng" ? "3" : data.village.toLowerCase() === "pathara" ? "4" : "0",
            ward: data.ward,
            house:data.house,
            family:data.family,
            epicNumber: data.epicNumber == undefined || "" ? "" :data.epicNumber,
              rationDetails: {
                  ration: data.ration == undefined || "" ? false : data.ration.toLowerCase() === 'yes' || "y" ? true : false,
                  rationNo: data.rationNo == undefined || "" ? "" :data.rationNo,
                  rationType: data.rationType == undefined || "" ? "" :data.rationType,
                  activatedOn: data.activatedOn == undefined || "" ? "" :data.activatedOn,
              },
              healthDetails: {
                  hasDisease: data.hasDisease == undefined || "" ? "" : data.hasDisease.toLowerCase() === 'yes' || "y" ? true : false,
                  diseaseName: data.diseaseName == undefined || "" ? "" : data.diseaseName.trim().toLowerCase() === "" ? "NA" :data.diseaseName.toLowerCase(),
                  diseaseDate: data.diseaseDate == undefined || "" ? "" : data.diseaseDate,
                  isHandicapped: data.isHandicapped == undefined || "" ? "" : data.isHandicapped.toLowerCase() === 'yes' || "y" ? true : false,
                  hasHealthCard: data.hasHealthCard == undefined || "" ? "" : data.hasHealthCard.toLowerCase() === 'yes' || "y" ? true : false,
                  healthCardNo: data.healthCardNo == undefined || "" ? "" : data.healthCardNo,
              },
              ruralHouse: {
                  hasHouse: data.hasHouse == undefined || "" ? "" : data.hasHouse.toLowerCase() === 'yes' || "y" ? true : false,
                  houseType: data.houseType == undefined || "" ? "" : data.houseType,
                  landless: data.hasHouse == undefined || "" ? "" : data.hasHouse.toLowerCase() === 'yes' || "y" ? true : false,
                  katchaPakkaGhar: data.katchaPakkaGhar == undefined || "" ? "" : data.katchaPakkaGhar.toLowerCase() === "" ? "NA" :data.katchaPakkaGhar.toLowerCase(),
              },

              carrer:{
                qualification: data.qualification == undefined || "" ? "NA" :data.qualification.toLowerCase(),
                course:data.course == undefined || "" ? "NA" : data.course.toLowerCase(),
                other:data.other == undefined || "" ? "NA" :data.other.toLowerCase(),
              },
              bplStatus: data.bplStatus == undefined || "" ? false : data.bplStatus.toLowerCase() == 'yes' || "y" ? true : false,
              insuranceStatus: data.insuranceStatus == undefined || "" ? false : data.insuranceStatus.toLowerCase() === 'yes' || "y" ? true : false,
              occupation: data.occupation == undefined || "" ? "" :data.occupation.toLowerCase(),
              aadhaarCardNo: data.aadhaarCardNo == undefined || "" ? "" :data.aadhaarCardNo,
              mobileNo: data.mobileNo == undefined || "" ? "" :data.mobileNo,
              street: data.street == undefined || "" ? "" :data.street.toLowerCase(),
              dob: data.dob == undefined || "" ? "" :data.dob,
              bg: data.bg == undefined || "" ? "" : data.bg.toLowerCase() === "a+" ? "A+" : data.bg.toLowerCase() === "a-" ? "A-" : data.bg.toLowerCase() === "b+" ? "B+" :data.bg.toLowerCase() === "b-" ? "B-" : data.bg.toLowerCase() === "ab+" ? "AB+" : data.bg.toLowerCase() === "ab-" ? "AB-" : data.bg.toLowerCase() === "o+" ? "O+" : data.bg.toLowerCase() === "o-" ? "O-" : "",
              bankAccount: data.bankAccount == undefined || "" ? false : data.bankAccount.toLowerCase() === 'yes' || "y" ? true : false,
              drinkingWater: data.drinkingWater == undefined || "" ? false : data.drinkingWater.toLowerCase() === 'yes' || "y" ? true : false,
              cowShed: data.cowShed  == undefined || "" ? false : data.cowShed.toLowerCase() === 'yes' || "y" ? true : false,
              hasCow: data.hasCow == undefined || "" ? false : data.hasCow.toLowerCase() === 'yes' || "y" ? true : false
          });
            await newUser.save();
        });
        logger.info('Data uploaded successfully');
        const users = await Survey.find();
        const user = await req.user;
        req.flash('success_msg', 'Data has been successfully uploaded!');
        res.render('dashboard', { users, user: user });
      } catch (e) {
        console.error(e);
        logger.error(e);
        res.status(500).send('Error saving data to the database.');
      }

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
              'gender':req.body.gender,
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
                'bg': req.body.bg,
                'bankAccount': req.body.bankAccount === 'yes' ? true : false,
                'drinkingWater': req.body.drinkingWater === 'yes' ? true : false,
                'cowShed': req.body.cowShed === 'yes' ? true : false,
                'hasCow': req.body.hasCow === 'yes' ? true : false,
                'landless': req.body.landless === 'yes' ? true : false,
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
            logger.info("info is not updated for ", req.params.id);
        }else {
          logger.info("info is updated for ", req.params.id);
        }
        res.redirect('/dashboard');
        // res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        logger.error('Error updating user:', error)
        res.status(500).json({ message: 'Server error' });
    }
});

// Search functionality
router.post('/search', async (req, res) => {
  // const searchQuery = req.body.searchQuery;
  const { userName, familyNo, houseNo, village, ward } = req.query;
  // Create query object dynamically based on non-empty search parameters
    const searchQuery = {};
    if (userName) {
      searchQuery.userName = { $regex: userName, $options: 'i' }; // Case-insensitive search
    }
    if (familyNo) {
      searchQuery.familyNo = familyNo;
    }
    if (houseNo) {
      searchQuery.houseNo = houseNo;
    }

    if (village) {
      searchQuery.village = { $regex: village, $options: 'i' }; // Case-insensitive search
    }

    if (ward) {
      searchQuery.ward = ward;
    }

  const users = await Survey.find(searchQuery);
  res.render('dashboard', { users });
});
router.get('/search', async (req, res) => {
  try {
    const { userName, familyNo, houseNo, village, ward } = req.query;

    const searchQuery = {};
    if (userName) searchQuery.userName = { $regex: userName, $options: 'i' };
    if (familyNo) searchQuery.familyNo = familyNo;
    if (houseNo) searchQuery.houseNo = houseNo;
    if (village) searchQuery.village = { $regex: village, $options: 'i' };
    if (ward) searchQuery.ward = ward;

    const users = await Survey.find(searchQuery);
    console.log("user : "+ users);
    // Render only the search results (no layout)
   res.render('dashboard', { users });
 } catch (err) {
   res.status(500).send('Server Error');
   logger.error(err);
 }
});
// Delete user route
router.get('/delete/:id', async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    const users = await Survey.find();
    logger.info("user is deleted for ", req.params.id)
    res.render('dashboard', {users});
  } catch (e) {
    logger.error(e);
  }

});
// Edit user route
router.get('/edit/:id', async (req, res) => {
  const users = await Survey.findById(req.params.id);
  console.log("user at edit : "+users);
  const user = await req.user;
  res.render('editUser', { users,user:user });
});
router.get('/addMember/:id', async (req, res) => {
  const users = await Survey.findById(req.params.id);
  console.log("user at edit : "+users);
  const user = await req.user;
  res.render('addMember', { users, user:user });
});
router.post('/addMember/:id', async (req, res) => {
  try {
    const newUser = new Survey({
      userName: req.body.userName,
      fatherHusbandName: req.body.fatherHusbandName,
      gender:req.body.gender,
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
    logger.error(e);
    res.status(500).json({ message: 'Server error' });
  }
})
router.post('/submit', (req, res) => {
  console.log('Received data:', req.body);
  try {
    const newUser = new Survey({
      userName: req.body.userName,
      fatherHusbandName: req.body.fatherHusbandName,
      gender:req.body.gender,
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
      bg:req.body.bg,
      bankAccount: req.body.bankAccount === 'yes',
      drinkingWater: req.body.drinkingWater === 'yes',
      cowShed: req.body.cowShed === 'yes',
      hasCow: req.body.hasCow === 'yes',
    });

    newUser.save().then(() => res.redirect('/dashboard'));
  } catch (e) {
    console.error('Error inserting data:', e);
    logger.error(e)
    res.status(500).json({ message: 'Server error' });
  }

});
module.exports = router;
