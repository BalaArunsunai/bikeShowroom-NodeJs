const express = require('express');
const router = express.Router();
const auth = require('../custom/authenticate').verifyToken;
const multer = require('multer')
const Customer = require('../controllers/customerController');

const customerImageContainer = 'data/image/customerImage';

var imageStorage = function (photosFolder) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, photosFolder);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
};

var imageUpload = function (imagesFolder) {
    return multer({
        storage: imageStorage(imagesFolder)
    });
};


router.post('/register-new-customer', Customer.registerNewCustomer);

router.post('/fetch-new-customer-profile', Customer.newCustomerProfile);

router.post('/new-customer-update-profile', Customer.newCustomerUpdateProfile);

router.post('/fetch-all-customer', Customer.fetchAllNewCustomer);

router.post('/search-customers', Customer.searchCustomers);

router.post('/upload-customer-image', imageUpload(customerImageContainer).any(), Customer.uploadCustomerImage);

router.post('/delete-new-customer', Customer.deleteNewCustomer)

module.exports = router;