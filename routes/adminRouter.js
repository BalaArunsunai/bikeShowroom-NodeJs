const express = require('express');
const router = express.Router();
const config = require("../config");

const Admin = require('../controllers/adminController');

router.post(`/register-dealer`, Admin.registerDealer);

router.post(`/update-advertisement`, Admin.updateAdvertisement);


module.exports = router;