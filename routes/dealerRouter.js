const express = require('express');
const router = express.Router();
const auth = require('../custom/authenticate').verifyToken;
const multer = require('multer');
const Dealer = require('../controllers/dealerController');

const dealerImageContainer = 'data/image/dealer';
const staffImageContainer = 'data/image/staff'

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



router.post('/dealer-login', Dealer.dealerLogin);

router.post('/fetch-dealer-profile', auth, Dealer.dealerProfile);

router.post('/dealer-change-password', Dealer.dealerChangePassword);

router.post('/dealer-forget-password', auth, Dealer.dealerForgetPassword);

router.post('/edit-dealer-service-center-details', Dealer.editDealerServiceCenterDetails);

router.post('/view-holidays', Dealer.viewHolidays);

router.post('/update-dealer-emergency-contacts', Dealer.updateDealerEmergencyContacts);

router.post('/delete-dealer-emergency-contacts', Dealer.deleteDealerEmergencyContacts);

router.post('/edit-service-center-details', Dealer.editServiceCenterDetails);

//user management
router.post('/create-dealer-staff', Dealer.createDealerStaff);

router.post('/fetch-dealer-perticular-staff-details', Dealer.fetchDealerPerticularStaffDetails);

router.post('/fetch-dealer-all-staff-details', Dealer.fetchDealerAllStaffDetails);

router.post('/delete-dealer-staff', Dealer.deleteDealerStaff);

router.post('/edit-dealer-staff-details', Dealer.editDealerStaffDetails);

router.post('/search-dealer-staff', Dealer.searchDealerStaff);

router.post("/deactivate-dealer-staff", Dealer.deactivateDealerStaff);

router.post('/activate-dealer-staff', Dealer.activateDealerStaff);

router.post("/upload-dealer-staff-image", imageUpload(staffImageContainer).any(), Dealer.uploadDealerStaffImage);

router.post('/upload-dealer-image', imageUpload(dealerImageContainer).any(), Dealer.uploadDealerImage);

module.exports = router;