const express = require('express');
const router = express.Router();
const config = require("../config");

const mobileController = require('../controllers/mobileController');

router.post('/login-with-mobile-number', mobileController.loginWithMobileNumber);

router.post('/otp-verification', mobileController.otpVerification);

router.post('/service-center-list', mobileController.serviceCenterList);

/* all services api is pending */

router.post('/customer-vehicle-details-list', mobileController.customerVehicleDetailsList)

router.post('/default-service-center-list', mobileController.defaultServiceCenterList)

router.post('/vehicle_service_type', mobileController.vehicle_service_type)

router.post('/fetch-user-data', mobileController.fetchUserData)

router.post('/update-user-info', mobileController.updateUserInfo)

router.post('/update-saved-location-address', mobileController.updateSavedLocationAddress)


module.exports = router