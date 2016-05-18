'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Listing = mongoose.model('Listing'),

  nodemailer = require('nodemailer'),
  smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Update user details
 */


/**
 * Update profile picture
 todo by ashok 5 5 2016
 save images in respective listings folders
 save listings with the respective images names and location.
 */

exports.AddPicture = function (req, res) {
  var user = req.user;
  var listing = req.listing;
  var message = null;
  console.log(listing);
  var upload = multer({ dest : './modules/listings/client/img/uploads/'+ listing._id  }).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (listing) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        listing.listingImageURL = './modules/listings/client/img/uploads/'+ listing._id + '/' + req.file.filename;

        listing.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
                res.json(listing);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**er
 * Send User
 */
exports.AddBooking = function (req, res) {
  var user = req.user;
  var listing = req.listing;
 // var user2 = user;


  console.log(user.email);
  //console.log(user2);
  console.log(listing.user.email);
  
};
  /**
 * Listing middleware
 */
  exports.listingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Listing is invalid'
    });
  }

  Listing.findById(id).populate('user', 'email').exec(function (err, listing) {
    if (err) {
      return next(err);
    } else if (!listing) {
      return res.status(404).send({
        message: 'No Listing with that identifier has been found'
      });
    }
    req.listing = listing;
    next();
  });
  
};
