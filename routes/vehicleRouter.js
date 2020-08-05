const express = require('express');
const router = express.Router();
const multer = require('multer')
const auth = require('../custom/authenticate').verifyToken;
const Vehicle = require('../controllers/vehicleController');
const vehicleImages = 'data/image/vehicleModelImages';

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

router.post('/create-vehicle-model-services', Vehicle.createVehicleModelServices);

router.post('/create-vehicle-model', imageUpload(vehicleImages).any(), Vehicle.createVehicleModel);

router.post('/delete-vehicle-model', Vehicle.deleteVehicleModel);

router.post('/fetch-vehicle-model-services', Vehicle.fetchVehicleModelServices);

router.get('/fetch-vehicle-image/:detail', Vehicle.fetchVehicleImage);

router.post('/create-vehicle-check-list', Vehicle.createVehicleChecklist);

router.post('/fetch-vehicle-check-list', Vehicle.fetchVehicleCheckList);

router.post('/fetch-all-vehicle-check-list', Vehicle.fetchAllVehicleCheckList);

router.post('/delete-vehicle-check-list', Vehicle.deleteVehicleChecklist);

router.post('/fetch-all-vehicle', Vehicle.fetchAllVehicle);

router.post('/delete-vehicle-model', Vehicle.deleteVehicleModel);

router.post('/edit-vehicle-model', Vehicle.editVehicleModel);

router.post('/edit-vehicle-service', Vehicle.editVehicleService);

router.post('/delete-vehicle-service', Vehicle.deleteVehicleServiceModel);

module.exports = router;
