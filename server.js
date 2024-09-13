const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gramPanchayatDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Data Schema
const userSchema = new mongoose.Schema({
  userName: String,
  fatherHusbandName: String,
  village: String,
  ward: String,
  epicNumber: String,
  rationDetails: {
    rationNo: String,
    rationType: String, // State/Central
    activatedOn: Date,
  },
  healthDetails: {
    hasDisease: Boolean,
    diseaseName: String,
    diseaseDate: Date,
  },
  ruralHouse: {
    hasHouse: Boolean,
    houseType: String, // PMAY, Nirman Shramika, etc.
    houseStatus: String, // Complete/Incomplete
    houseDate: Date,
  },
  katchaPakkaGhar: String,
  isHandicapped: Boolean,
  bplStatus: Boolean,
  insuranceStatus: Boolean,
  qualification: String,
  occupation: String,
  aadhaarCardNo: String,
  mobileNo: String,
  street: String,
  dob: Date,
  voterCardNo: String,
  bankAccount: Boolean,
  drinkingWater: Boolean,
  cowShed: Boolean,
  hasCow: Boolean,
  landless: Boolean,
});

const User = mongoose.model('User', userSchema);

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Display all records
app.get('/users', async (req, res) => {
  const users = await User.find();
  console.log("user at users : "+ users);
  res.render('users', { users });
});

// Search functionality
app.post('/search', async (req, res) => {
  const searchQuery = req.body.searchQuery;
  const users = await User.find({ userName: { $regex: searchQuery, $options: 'i' } });
  res.render('users', { users });
});
// Edit user route
app.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log("user at edit : "+user);
  res.render('editUser', { user });
});

// Update user route
app.post('/update/:id', async (req, res) => {
  try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
              'userName': req.body.userName,
              'fatherHusbandName': req.body.fatherHusbandName,
              'village': req.body.village,
              'ward': req.body.ward,
              'epicNumber': req.body.epicNumber,
              'rationDetails.rationNo': req.body.rationNo,
              'rationDetails.rationType': req.body.rationType,
              'rationDetails.activatedOn': req.body.activatedOn,
              'healthDetails.hasDisease': req.body.hasDisease  === 'yes' ? true : false,
              'healthDetails.diseaseName': req.body.diseaseName,
              'healthDetails.diseaseDate': req.body.diseaseDate,
              'ruralHouse.hasHouse': req.body.hasHouse  === 'yes' ? true : false,
              'ruralHouse.houseType': req.body.houseType,
              'ruralHouse.houseStatus': req.body.houseStatus,
              'ruralHouse.houseDate': req.body.houseDate,
                'katchaPakkaGhar': req.body.katchaPakkaGhar,
                'isHandicapped': req.body.isHandicapped === 'yes' ? true : false,
                'bplStatus': req.body.bplStatus === 'yes' ? true : false,
                'insuranceStatus': req.body.insuranceStatus === 'yes' ? true : false,
                'qualification': req.body.qualification,
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

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
  // console.log("id :" + req.params.id);
  // console.log("rationNo :" + req.body.rationNo);
  // console.log("rationType :" + req.body.rationType);
  // console.log("activatedOn :" + req.body.activatedOn);
  // console.log("hasDisease :" + req.body.hasDisease);
  // console.log("diseaseName :" + req.body.diseaseName);
  // console.log("diseaseDate :" + req.body.diseaseDate);
  // console.log("hasHouse :" + req.body.hasHouse);
  // console.log("houseType :" + req.body.houseType);
  // console.log("houseStatus :" + req.body.houseStatus);
  // console.log("houseDate :" + req.body.houseDate);
  // console.log("mobileNo :" + req.body.mobileNo);
  // const newUser = new User({
  //   userName: req.body.userName,
  //   fatherHusbandName: req.body.fatherHusbandName,
  //   village: req.body.village,
  //   ward: req.body.ward,
  //   epicNumber: req.body.epicNumber,
  //     rationDetails: {
  //         rationNo: req.body.rationNo,
  //         rationType: req.body.rationType,
  //         activatedOn: req.body.activatedOn,
  //     },
  //     healthDetails: {
  //         hasDisease: req.body.hasDisease === 'Yes' ? true : false,
  //         diseaseName: req.body.diseaseName,
  //         diseaseDate: req.body.diseaseDate,
  //     },
  //     ruralHouse: {
  //         hasHouse: req.body.hasHouse === 'Yes' ? true : false,
  //         houseType: req.body.houseType,
  //         houseStatus: req.body.houseStatus,
  //         houseDate: req.body.houseDate,
  //     },
  //     katchaPakkaGhar: req.body.katchaPakkaGhar,
  //     isHandicapped: req.body.isHandicapped === 'Yes' ? true : false,
  //     bplStatus: req.body.bplStatus === 'Yes' ? true : false,
  //     insuranceStatus: req.body.insuranceStatus === 'Yes' ? true : false,
  //     qualification: req.body.qualification,
  //     occupation: req.body.occupation,
  //     aadhaarCardNo: req.body.aadhaarCardNo,
  //     mobileNo: req.body.mobileNo,
  //     street: req.body.street,
  //     dob: req.body.dob,
  //     bankAccount: req.body.bankAccount === 'Yes' ? true : false,
  //     drinkingWater: req.body.drinkingWater === 'Yes' ? true : false,
  //     cowShed: req.body.cowShed === 'Yes' ? true : false,
  //     hasCow: req.body.hasCow === 'Yes' ? true : false,
  //     landless: req.body.landless === 'Yes' ? true : false,
  // });
  // await User.findByIdAndUpdate(req.params.id, req.body);
  //res.redirect('/users');
});

// Delete user route
app.post('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});
// Upload Excel file and parse it
app.post('/upload', upload.single('file'), async (req, res) => {
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
        const newUser = new User({
          userName: data.userName,
          fatherHusbandName: data.fatherHusbandName,
          village: data.village,
          ward: data.ward,
          epicNumber: data.epicNumber === "" ? "NA" :data.epicNumber,
            rationDetails: {
                rationNo: data.rationNo === "" ? "NA" :data.rationNo,
                rationType: data.rationType === "" ? "NA" :data.rationType,
                activatedOn: data.activatedOn === "" ? "NA" :data.activatedOn,
            },
            healthDetails: {
                hasDisease: data.hasDisease === 'Yes' ? true : false,
                diseaseName: data.diseaseName === "" ? "NA" :data.diseaseName,
                diseaseDate: data.diseaseDate === "" ? "NA" :data.diseaseName ,
            },
            ruralHouse: {
                hasHouse: data.hasHouse === 'Yes' ? true : false,
                houseType: data.houseType === "" ? "NA" :data.diseaseName,
                houseStatus: data.houseStatus === "" ? "NA" :data.diseaseName,
                houseDate: data.houseDate === "" ? "NA" :data.diseaseName,
            },
            katchaPakkaGhar: data.katchaPakkaGhar === "" ? "NA" :data.katchaPakkaGhar,
            isHandicapped: data.isHandicapped === 'Yes' ? true : false,
            bplStatus: data.bplStatus === 'Yes' ? true : false,
            insuranceStatus: data.insuranceStatus === 'Yes' ? true : false,
            qualification: data.qualification === "" ? "NA" :data.qualification,
            occupation: data.occupation === "" ? "NA" :data.occupation,
            aadhaarCardNo: data.aadhaarCardNo === "" ? "NA" :data.aadhaarCardNo,
            mobileNo: data.mobileNo === "" ? "NA" :data.mobileNo,
            street: data.street === "" ? "NA" :data.street,
            dob: data.dob === "" ? "NA" :data.dob,
            bankAccount: data.bankAccount === 'Yes' ? true : false,
            drinkingWater: data.drinkingWater === 'Yes' ? true : false,
            cowShed: data.cowShed === 'Yes' ? true : false,
            hasCow: data.hasCow === 'Yes' ? true : false,
            landless: data.landless === 'Yes' ? true : false,
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
// Routes
app.get('/', (req, res) => {
  res.render('form');
});



app.post('/submit', (req, res) => {
  console.log('Received data:', req.body);
  try {
    const newUser = new User({
      userName: req.body.userName,
      fatherHusbandName: req.body.fatherHusbandName,
      village: req.body.village,
      ward: req.body.ward,
      epicNumber: req.body.epicNumber,
      rationDetails: {
        rationNo: req.body.rationNo,
        rationType: req.body.rationType,
        activatedOn: req.body.activatedOn,
      },
      healthDetails: {
        hasDisease: req.body.hasDisease === 'yes',
        diseaseName: req.body.diseaseName,
        diseaseDate: req.body.diseaseDate,
      },
      ruralHouse: {
        hasHouse: req.body.hasHouse === 'yes',
        houseType: req.body.houseType,
        houseStatus: req.body.houseStatus,
        houseDate: req.body.houseDate,
      },
      katchaPakkaGhar: req.body.katchaPakkaGhar,
      isHandicapped: req.body.isHandicapped === 'yes',
      bplStatus: req.body.bplStatus === 'yes',
      insuranceStatus: req.body.insuranceStatus === 'yes',
      qualification: req.body.qualification,
      occupation: req.body.occupation,
      aadhaarCardNo: req.body.aadhaarCardNo,
      mobileNo: req.body.mobileNo,
      street: req.body.street,
      dob: req.body.dob,
      voterCardNo: req.body.voterCardNo,
      bankAccount: req.body.bankAccount === 'yes',
      drinkingWater: req.body.drinkingWater === 'yes',
      cowShed: req.body.cowShed === 'yes',
      hasCow: req.body.hasCow === 'yes',
      landless: req.body.landless === 'yes',
    });

    newUser.save().then(() => res.redirect('/'));
  } catch (e) {
    console.error('Error inserting data:', e);
        res.status(500).json({ message: 'Server error' });
  }

});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
