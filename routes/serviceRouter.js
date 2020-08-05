const express = require('express');
const router = express.Router();

const Service = require('../controllers/serviceController');

router.post('/upload-service-booking-request', Service.uploadServiceBookingRequest);

router.post('/fetch-all-service-booking-request', Service.fetchAllServiceBookingRequest);

router.post('/search-on-service-booking-request', Service.searchOnServiceBookingRequest);

module.exports = router;



