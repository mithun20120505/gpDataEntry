const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { ensureAuthenticated, ensureAdmin, forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    let errors = [];

    // Check required fields
    if (!username || !email || !password || !confirmPassword) {
      console.log(username);console.log(email);console.log(password);console.log(password2);
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      console.log("hi2")
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check pass length
    if (password.length < 6) {
      console.log("hi3")
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
      console.log("hi4")
        res.render('register', {
            errors,
            username,
            email,
            password,
            confirmPassword
        });
    } else {
        // Validation passed

        User.findOne({$or:[ { email: email },{username : username}]}).then(user => {
            if (user) {
              console.log("hi6")
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    username,
                    email,
                    password,
                    confirmPassword
                });
            } else {
              var role = "user";
                const newUser = new User({
                    username,
                    email,
                    password,
                    role
                });
                console.log(newUser)
                // Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        console.log("hash : "+hash);
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     return res.redirect('/dashboard'); // Error handling if needed
  //   }
  //   res.clearCookie('connect.sid'); // Clear session cookie
  //   res.redirect('/users'); // Redirect to login page
  // });
    // req.flash('success_msg', 'You are logged out');
    // res.redirect('/users');
    req.logout((err) => {
    if (err) {
      return next(err); // Handle error properly
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users'); // Redirect to login page after logout
  });
});

module.exports = router;
