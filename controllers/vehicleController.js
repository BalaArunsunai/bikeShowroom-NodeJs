const connection = require('../database/db');
const path = require('path')
const fs = require('fs');
const jwt = require('jsonwebtoken');
logger = require("../lib/logger").logger
const config = require('../config');



exports.createVehicleModelServices = (req, res) => {
    // jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.body;
    vehicle_model_id = data.vehicle_model_id;
    number_of_free_services = data.number_of_free_services;
    free_service_name = data.free_service_name;
    free_service_km = data.free_service_km;
    duration = data.free_service_duration;
    tag = data.tag;
    if (tag == "createVehicleModelServices") {
        connection.query(`select * from vehicle_model where vehicle_model_id=?`, [vehicle_model_id], (err, rows) => {
            if (rows.length != null) {
                var obj = []
                rows.forEach(element => {
                    obj.push(element);
                });
                connection.query(`INSERT INTO  vehicle_free_service_details (vehicle_model_id, number_of_free_services, free_service_name, free_service_km, duration) values (?,?,?,?,?)`, [obj[0].vehicle_model_id, number_of_free_services, free_service_name, free_service_km, duration], (err, rows) => {
                    if (rows) {
                        if (err) {
                            return res.send(err)
                        }
                        connection.query(`select * from vehicle_free_service_details where vehicle_model_id = ?`, [vehicle_model_id], (err, result) => {

                            return res.status(200).json({ status: "true", message: "success", error: "0", rows: result })
                        })

                    }
                })
            } else {
                return res.status(401).json({ status: 'false', error: "1", message: 'not found' })
            }
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.createVehicleModel = (req, res) => {
    const data = req.body;
    vehicle_manufacturer_id = data.vehicle_manufacturer_id;
    vehicle_model_name = data.vehicle_model_name;
    vehicle_model_image = req.files[0].path;
    created_date = new Date();
    tag = data.tag;
    if (tag == "createVehicleModel") {
        connection.query(`select * from vehicle_manufacturer where vehicle_manufacturer_id=?`, [vehicle_manufacturer_id], (err, rows) => {
            if (err) {
                throw err;
            }
            if (rows.length != null) {
                connection.query(`insert into vehicle_model (vehicle_manufacturer_id, vehicle_model_name, vehicle_model_image, created_date) values(?,?,?,?)`, [rows[0].vehicle_manufacturer_id, vehicle_model_name, vehicle_model_image, created_date], (err, rows) => {
                    if (err) {
                        throw err;
                    } else {

                        connection.query(`select * from vehicle_model where vehicle_model_id = ?`, [rows.insertId], (err, rows) => {
                            if (err) {
                                console.log(err);
                            }
                            rows[0].vehicle_model_image = "/" + rows[0].vehicle_model_image.split('/').splice(1).join('/');
                            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                        })

                    }
                })
            } else {
                return res.status(401).json({ status: 'false', error: "1", message: 'vehicle manufacturer not found' })
            }
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.deleteVehicleModel = (req, res) => {
    // jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.body;
    vehicle_model_id = data.vehicle_model_id
    tag = data.tag;
    if (tag == "deleteVehicleModel") {
        connection.query(`delete from vehicle_model where vehicle_model_id=?`, [vehicle_model_id], (err, rows) => {
            if (!err) {
                connection.query(`delete from vehicle_free_service_details where vehicle_model_id=?`, [vehicle_model_id], (err, rows) => {
                    if (!err) {
                        connection.query(`delete from vehicle_paid_service_details where vehicle_model_id=?`, [vehicle_model_id], (err, rows) => {
                            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                        })
                    }
                })
            }
        })
    } else {
        logger.log({ level: "error", message: `Error: ${error}` });
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchVehicleModelServices = (req, res) => {
    //  jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.body;
    tag = data.tag;
    vehicle_model_id = data.vehicle_model_id;
    if (tag == "fetchVehicleModelServices") {
        connection.query(`select * from vehicle_free_service_details where vehicle_model_id = ?`, [vehicle_model_id], (err, rows) => {
            if (!err) {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            } else {
                return res.send(err);
            }
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchVehicleImage = (req, res) => {
    fs.stat(path.resolve(`${config.server.path}image/vehicleModelImages/${req.params.detail}`), function (err) {
        if (err) {
            logger.log({ level: 'error', message: `Error processing request:${err}` });
            return res.status(401).json({ success: false, message: `Error processing your request${err}` });
        }
        res.sendFile(path.resolve(`${config.server.path}image/vehicleModelImages/${req.params.detail}`));
    });

}

exports.createVehicleChecklist = (req, res) => {
    const data = req.body;
    data.forEach((item) => {
        tag = item.tag;
        vehicle_model_id = item.vehicle_model_id;
        list = item.list;
        if (tag == 'createVehicleChecklist') {
            connection.query(`select * from vehicle_model where vehicle_model_id =?`, [vehicle_model_id], (err, rows) => {
                if (err) {
                    return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
                }
                if (rows) {
                    connection.query(`insert into check_list (vehicle_model_id, list) values(?, ?)`, [vehicle_model_id, list], (err, rows) => {
                        if (rows) {
                            connection.query(`select * from check_list where vehicle_model_id = ?`, [vehicle_model_id], (err, rows) => {
                                if (err) {
                                    return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
                                }
                                return res.end(JSON.stringify({ status: "true", message: "success", error: "0", rows }))
                            })
                        }
                    })
                }
            })
        } else {
            return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    })

}

exports.fetchVehicleCheckList = (req, res) => {
    const data = req.body;
    tag = data.tag;
    vehicle_model_id = data.vehicle_model_id;
    if (tag == 'fetchVehicleCheckList') {
        connection.query(`select * from check_list where vehicle_model_id = ?`, [vehicle_model_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
            }
            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchAllVehicleCheckList = (req, res) => {
    const data = req.body;
    tag = data.tag;
    if (tag == 'fetchAllVehicleCheckList') {
        connection.query(`select * from check_list`, (err, rows) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
            }
            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.deleteVehicleChecklist = (req, res) => {
    const data = req.body;
    check_list_id = data.check_list_id;
    tag = data.tag;
    if (tag == 'deleteVehicleChecklist') {
        connection.query(`delete from check_list where check_list_id = ?`, [check_list_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
            }
            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchAllVehicle = (req, res) => {
    const data = req.body;
    tag = data.tag;
    if (tag == 'fetchAllVehicle') {
        connection.query(`select * from vehicle_model`, (err, rows) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
            }
            if (rows) {
                rows.map(detail => {
                    if (detail.vehicle_model_image !== 'false')
                        detail.vehicle_model_image = detail.vehicle_model_image.split('/').splice(1).join('/');
                    return detail
                })
                return res.status(200).json({ status: 'true', error: "0", message: `successfully fethed details`, rows });
            }
        });

    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.deleteVehicleModel = (req, res) => {
    const data = req.body;
    tag = data.tag;
    vehicle_model_id = data.vehicle_model_id;
    if (tag == 'deleteVehicleModel') {
        connection.query(`select * from vehicle_model where vehicle_model_id = ?`, [vehicle_model_id], (err, model) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
            }
            var modelimage = model.vehicle_model_image.split('/').pop();
            if (model) {
                connection.query(`delete from vehicle_free_service_details where vehicle_model_id = ?`, [vehicle_model_id], (err, deleted) => {
                    if (err) {

                    } if (deleted) {

                        connection.query(`delete from vehicle_paid_service_details where vehicle_model_id = ?`, [vehicle_model_id], (err, deleted) => {
                            if (err) {

                            } if (deleted) {
                                connection.query(`delete from vehicle_model where vehicle_model_id= ?`, [vehicle_model_id], (err) => {
                                    if (err) {
                                        return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
                                    }
                                    fs.unlink(path.resolve(config.path + 'image/vehicleModelImages/' + modelimage), function (err) {
                                        if (err) {
                                            logger.log({ level: 'error', message: `deleting file failed ${err}` });
                                        }
                                        logger.log({ level: 'info', message: `deleting file success.` });
                                    });
                                    return res.status(200).json({ status: 'true', error: "0", message: `successfully deleted!` });
                                })
                            }
                        })
                    }
                })
            }
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.editVehicleModel = (req, res) => {
    const data = req.body;
    tag = data.tag;
    vehicle_model_id = data.vehicle_model_id;
    vehicle_model_name = data.vehicle_model_name;
    if (tag == 'editVehicleModel') {
        connection.query(`select * from vehicle_model where vehicle_model_id = ?`, [vehicle_model_id], (err, model) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
            } if (model) {
                connection.query(`update vehicle_model set vehicle_model_name = ? where vehicle_model_id = ?`, [vehicle_model_name, vehicle_model_id], (err, updated) => {
                    if (err) {
                        return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
                    }
                    if (updated) {
                        connection.query(`select vehicle_model_name from vehicle_model where vehicle_model_id = ?`, [vehicle_model_id], (err, rows) => {
                            if (err) {
                                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
                            }
                            return res.status(200).json({ status: 'true', error: "0", message: `successfully updated`, rows });
                        })
                    }
                })
            } else {
                return res.status(200).json({ status: 'false', error: "1", message: 'not found' })
            }
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.editVehicleService = (req, res) => {
    const data = req.body;
    tag = data.tag;
    vehicle_model_id = data.vehicle_model_id;
    number_of_free_services = data.number_of_free_services;
    free_service_km = data.free_service_km;
    duration = data.duration;
    if (tag == 'editVehicleService') {
        connection.query(`update vehicle_free_service_details set number_of_free_services = ?, free_service_km = ?, duration = ? where vehicle_model_id = ?`, [number_of_free_services, free_service_km, duration, vehicle_model_id], (err, rows) => {
            if (err) {
                return res.send(err);
            }
            return res.status(200).json({ status: 'true', error: "0", message: `successfully updated`, rows });

        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }

}


exports.deleteVehicleServiceModel = (req, res) => {
    const data = req.body;
    tag = data.tag;
    vehicle_free_service_id = data.vehicle_free_service_id;
    if (tag == 'deleteVehicleServiceModel') {
        connection.query(`delete from vehicle_free_service_details where vehicle_free_service_id = ?`, [vehicle_free_service_id], (err, result) => {
            if (err) {
                return res.send(err)
            }
            return res.status(200).json({ status: 'true', error: "0", message: `deleted!` });
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }

}