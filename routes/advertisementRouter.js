const express = require('express');
const router = express.Router();
const multer = require('multer');
const Advertisement = require('../controllers/advertisementController')

const advertisementContainer = 'data/image/advertisement';

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

router.post('/create-dealer-advertisement', imageUpload(advertisementContainer).any(), Advertisement.createDealerAdvertisement);

router.post('/edit-dealer-advertisement', imageUpload(advertisementContainer).any(), Advertisement.editDealerAdvertisement);

router.post('/delete-dealer-advertisement', Advertisement.deleteDealerAdvertisement);

router.post('/fetch-dealer-advertisement', Advertisement.fetchDealerAdvertisement);

router.post('/fetch-all-dealer-advertisement', Advertisement.fetchAllDealerAdvertisement);

// router.get('/fetch-image/:detail', Advertisement.fetchImage);



module.exports = router