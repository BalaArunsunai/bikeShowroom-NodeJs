const express = require('express');
const router = express.Router();
const multer = require('multer')
const auth = require('../custom/authenticate').verifyToken;

const vehicleImages = 'data/image/promoImage';

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
  

const Promo = require('../controllers/promoController');

router.post('/create-promo-for-customers',imageUpload().any(vehicleImages), Promo.CreatePromoForCustomers);

router.post('/delete-promo', Promo.deletePromo);

router.post('/fetch-all-promo', Promo.fetchAllPromo);

router.post('/edit-promo', Promo.editPromo);

router.post('/update-promo-status', Promo.updatePromoStatus);

router.post('/create-customer-promo-code-list', Promo.addCustomerPromoCodeList);

router.post('/fetch-customer-promo-code-list', Promo.fetchCustomerPromoCodeList);

router.post('/filter-promo-code-list', Promo.filterPromoCodeList);

module.exports = router;