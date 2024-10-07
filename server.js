const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const app = express();
const dotEnv = require("dotenv");
const LocalStrategy = require('passport-local').Strategy;
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');

// app.use((req, res, next) => {
//   res.locals.user = req.user || null;
//   next();
// });

// Models
const User = require('./models/User');
const Survey = require('./models/Survey');
// Passport configuration
require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 360000 } //{ secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// // Routes
// app.use('/auth', require('./routes/auth'));
// app.use('/admin', require('./routes/admin'));

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.set('view engine', 'ejs');

// Connect to MongoDB
dotEnv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// const upload = multer({ dest: 'uploads/' });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
