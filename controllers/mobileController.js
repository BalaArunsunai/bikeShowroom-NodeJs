const connection = require('../database/db');
const sendOtp = require('../lib/sendSms').sendOtp;
const verifyOtp = require('../lib/sendSms').verifyOtp;
const config = require('../config');


exports.loginWithMobileNumber = (req, res) => {
    const data = req.body;
    customer_mobile_number = data.customer_mobile_number
    tag = data.tag
    device_id = data.device_id
    if (tag == "loginWithMobileNumber") {
        connection.query('select * from customers where customer_mobile_number = ?', [customer_mobile_number], (err, customer) => {
            if (err) {
                console.log(err)
            }
            if (customer.length !== 0) {
                connection.query('select * from customer_details where customer_mobile_number = ?', [customer_mobile_number], (err, find) => {
                    if (err) {
                        console.log(err);
                    }
                    if (find.length == '') {
                        connection.query(`insert into customer_details (customer_mobile_number, device_id) values(?,?)`, [customer_mobile_number, device_id], (err, saved) => {
                            if (err) {
                                console.log(err);
                            }
                            sendUserOTP(data.customer_mobile_number)
                                .then(otpStatus => {
                                    if (otpStatus.type === "success") {
                                        return res.status(200).json({ status: "true", message: "success", error: "0", login_with_mobile: customer })
                                    } else {
                                        logger.log({ level: "error", message: `Error: ${otpStatus}` });
                                        return res.status(201).json({ success: false, message: "Unable to send otp at you mobile number" });
                                    }
                                })
                                .catch(err => {
                                    logger.log({ level: "error", message: `Error processing you request: ${err}` });
                                    return res.status(400).json({ success: false, message: "Error processing you request" });
                                });
                        })
                    } if (find) {
                        sendUserOTP(data.customer_mobile_number)
                            .then(otpStatus => {
                                if (otpStatus.type === "success") {
                                    return res.status(200).json({ status: "true", message: "success", error: "0", login_with_mobile: customer })
                                } else {
                                    logger.log({ level: "error", message: `Error: ${otpStatus}` });
                                    return res.status(201).json({ success: false, message: "Unable to send otp at you mobile number" });
                                }
                            })
                            .catch(err => {
                                logger.log({ level: "error", message: `Error processing you request: ${err}` });
                                return res.status(400).json({ success: false, message: "Error processing you request" });
                            });
                    }
                })
            } else {
                return res.status(200).json({ status: "false", message: "user not found!", error: "1" })
            }
        })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}


exports.otpVerification = (req, res) => {
    const data = req.body;
    tag = data.tag;
    otp = data.otp;
    customer_mobile_number = data.customer_mobile_number;
    if (tag == 'otpVerification') {
        connection.query('select * from customers where customer_mobile_number = ?', [customer_mobile_number], (err, find) => {
            if (err) {
                console.log(err);
            } if (find) {
                connection.query(`select C.* , CD.*, VCS.vehicle_service_center_id,VCS.vehicle_service_center_name, VM.vehicle_manufacturer_name, VMo.vehicle_model_name, VD.vehicle_detail_id, VD.vehicle_registration_number,VD.vehicle_purchased_date from customers AS C INNER JOIN customer_details AS CD
                ON C.customer_mobile_number = CD.customer_mobile_number INNER JOIN vehicle_service_center AS VCS 
                ON C.dealer_id = VCS.dealer_id INNER JOIN vehicle_manufacturer AS VM 
                ON VCS.vehicle_service_center_id = VM.vehicle_service_center_id INNER JOIN vehicle_model AS VMo
                ON VM.vehicle_manufacturer_id = VMo.vehicle_manufacturer_id INNER JOIN vehicle_details AS VD
                ON VMo.vehicle_model_id = VD.vehicle_model_id`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } if (result) {
                            console.log(result);
                            verifyUserOTP(data.customer_mobile_number, data.otp)
                                .then(otpStatus => {
                                    if (otpStatus.type === "success") {
                                        return res.status(200).json({ success: true, message: "success", error: "0", otpVerification: result });
                                    } else {
                                        logger.log({ level: "error", message: `Error: ${otpStatus}` });
                                        return res.status(200).json({ success: false, message: "Invalid otp" });
                                    }
                                })
                                .catch(err => {
                                    logger.log({ level: "error", message: `Error processing you request: ${err}` });
                                    return res.status(400).json({ success: false, message: "Error processing you request" });
                                });
                        }
                    })
            }
        })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.serviceCenterList = (req, res) => {
    const data = req.body;
    tag = data.tag;
    vehicle_manufacturer = data.vehicle_manufacturer
    if (tag == 'serviceCenterList') {
        connection.query(`select vsc.vehicle_service_center_id, vsc.vehicle_service_center_name, vsc.vehicle_service_center_email_id, vsc.vehicle_service_center_city, vsc.vehicle_service_center_address, vm.vehicle_manufacturer_name, vm.vehicle_service_center_id from  vehicle_service_center as vsc INNER JOIN vehicle_manufacturer AS vm 
        ON vm.vehicle_service_center_id = vsc.vehicle_service_center_id where vm.vehicle_manufacturer_name = ${vehicle_manufacturer}`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                return res.status(200).json({ success: true, message: "success", error: "0", serviceCenterList: result });
            })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.allServices = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_mobile_number = data.customer_mobile_number;
    if (tag == 'allServices') {

    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.customerVehicleDetailsList = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_mobile_number = data.customer_mobile_number;
    if (tag === 'customerVehicleDetailsList') {
        connection.query(`select cus.customer_id, cus.dealer_id, cus.customer_mobile_number, D.*, vsc.vehicle_service_center_name, vm.vehicle_manufacturer_name, vModel.vehicle_model_name, vDetail.vehicle_registration_number, vDetail.vehicle_purchased_date from customers as cus INNER JOIN dealers as D 
        ON cus.dealer_id = D.dealer_id INNER JOIN vehicle_service_center AS vsc 
        ON D.dealer_id = vsc.dealer_id INNER JOIN vehicle_manufacturer as vm 
        ON vsc.vehicle_service_center_id = vm.vehicle_service_center_id INNER JOIN vehicle_model AS vModel
        ON vm.vehicle_manufacturer_id = vModel.vehicle_manufacturer_id INNER JOIN vehicle_details as vDetail
        ON vModel.vehicle_model_id = vDetail.vehicle_model_id where cus.customer_mobile_number = ${customer_mobile_number}`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                return res.status(200).json({ success: true, message: "success", error: "0", customerVehicleDetails: result });
            })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.defaultServiceCenterList = (req, res) => {
    const data = req.body;
    tag = data.tag
    vehicle_manufacturer = data.vehicle_manufacturer;
    customer_mobile_number = data.customer_mobile_number;
    if (tag == 'defaultServiceCenterList') {
        connection.query(`select cus.customer_id, cus.dealer_id, cus.customer_mobile_number, D.*, vsc.vehicle_service_center_name, vm.vehicle_manufacturer_name, vModel.vehicle_model_name, vDetail.vehicle_registration_number, vDetail.vehicle_purchased_date from customers as cus INNER JOIN dealers as D 
     ON cus.dealer_id = D.dealer_id INNER JOIN vehicle_service_center AS vsc 
     ON D.dealer_id = vsc.dealer_id INNER JOIN vehicle_manufacturer as vm 
     ON vsc.vehicle_service_center_id = vm.vehicle_service_center_id INNER JOIN vehicle_model AS vModel
     ON vm.vehicle_manufacturer_id = vModel.vehicle_manufacturer_id INNER JOIN vehicle_details as vDetail
     ON vModel.vehicle_model_id = vDetail.vehicle_model_id where cus.customer_mobile_number = ? AND vm.vehicle_manufacturer_name = ?`, [customer_mobile_number, vehicle_manufacturer], (err, result) => {
                if (err) {
                    console.log(err);
                }
                return res.status(200).json({ success: true, message: "success", error: "0", defaultServiceCenterList: result });
            })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.vehicle_service_type = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_mobile_number = data.customer_mobile_number;
    service_type = data.service_type;
    service_center = data.service_center
    if (tag == 'vehicle_service_type') {
        if (service_type == 'Paid Service') {
            connection.query(`select cus.customer_id, cus.customer_mobile_number, vsc.vehicle_service_center_id, vm.vehicle_manufacturer_name, vmo.vehicle_model_name, VD.vehicle_registration_number, VD.vehicle_purchased_date, vps.paid_service_name,vps.paid_service_km, vps.paid_service_month from customers AS cus INNER JOIN vehicle_service_center AS vsc 
            ON cus.dealer_id = vsc.dealer_id INNER JOIN vehicle_manufacturer as vm 
            ON vsc.vehicle_service_center_id = vm.vehicle_service_center_id INNER JOIN vehicle_model as vmo 
            ON vm.vehicle_manufacturer_id = vmo.vehicle_manufacturer_id INNER JOIN vehicle_details as VD 
            ON vmo.vehicle_model_id = VD.vehicle_model_id INNER JOIN vehicle_paid_service_details AS vps
            ON VD.vehicle_model_id = vps.vehicle_model_id WHERE cus.customer_mobile_number = ? AND vsc.vehicle_service_center_name = ?`, [customer_mobile_number, service_center], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.status(200).json({ success: true, message: "success", error: "0", paidServiseList: result });
                })
        } else {
            connection.query(`select cus.customer_id, cus.customer_mobile_number, vsc.vehicle_service_center_id, vm.vehicle_manufacturer_name, vmo.vehicle_model_name, VD.vehicle_registration_number, VD.vehicle_purchased_date, vfs.free_service_name,vfs.free_service_km, vfs.free_service_month from customers AS cus INNER JOIN vehicle_service_center AS vsc 
            ON cus.dealer_id = vsc.dealer_id INNER JOIN vehicle_manufacturer as vm 
            ON vsc.vehicle_service_center_id = vm.vehicle_service_center_id INNER JOIN vehicle_model as vmo 
            ON vm.vehicle_manufacturer_id = vmo.vehicle_manufacturer_id INNER JOIN vehicle_details as VD 
            ON vmo.vehicle_model_id = VD.vehicle_model_id INNER JOIN vehicle_free_service_details AS vfs
            ON VD.vehicle_model_id = vfs.vehicle_model_id WHERE cus.customer_mobile_number = ? AND vsc.vehicle_service_center_name = ?`, [customer_mobile_number, service_center], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.status(200).json({ success: true, message: "success", error: "0", paidFreeList: result });
                })
        }
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchUserData = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_mobile_number = data.customer_mobile_number;
    if (tag == 'fetchUserData') {
        connection.query(`select * from customers where customer_mobile_number = ${customer_mobile_number}`, (err, rows) => {
            if (err) {
                console.log(err);
            }
            if (rows) {
                connection.query(`select cus.*, CD.* from customers as cus INNER JOIN customer_details AS CD
                                  ON cus.customer_mobile_number = CD.customer_mobile_number where cus.customer_mobile_number = ${customer_mobile_number}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        return res.status(200).json({ success: true, message: "success", error: "0", user_profile_detailsF: result });
                    })
            } else {
                return res.status(200).json({ success: false, message: "user not found", error: "1" });
            }
        })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.uploadImage = (req, res) => {

}

exports.updateUserInfo = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_mobile_number = data.customer_mobile_number;
    customer_email_id = data.customer_email_id;
    customer_saved_address = data.customer_saved_address
    if (tag == 'updateUserInfo') {
        connection.query(`select * from customers where customer_mobile_number = ${customer_mobile_number}`, (err, rows) => {
            if (err) {
                console.log(err);
            } if (rows) {
                connection.query(`update customers set customer_email_id = ?, customer_saved_address = ? where customer_mobile_number = ?`, [customer_email_id, customer_saved_address, customer_mobile_number], (err, result) => {
                    if (err) {
                        console.log(err);
                    } if (result) {
                        connection.query(`select cus.*, CD.* from customers as cus INNER JOIN customer_details AS CD
                        ON cus.customer_mobile_number = CD.customer_mobile_number where cus.customer_mobile_number = ${customer_mobile_number}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                return res.status(200).json({ success: true, message: "success", error: "0", updateUserInfo: result });
                            })
                    }
                })
            } else {
                return res.status(200).json({ success: true, message: "user not found", error: "1" });
            }
        })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.updateSavedLocationAddress = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_mobile_number = data.customer_mobile_number;
    customer_saved_location_address = data.customer_saved_location_address
    if (tag === 'updateSavedLocationAddress') {
        connection.query(`select * from customers where customer_mobile_number = ${customer_mobile_number}`, (err, rows) => {
            if (err) {
                console.log(err);
            }
            if (rows) {
                connection.query(`update customer_details set customer_saved_location_address = ? where customer_mobile_number = ?`, [customer_saved_location_address, customer_mobile_number], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result) {
                        connection.query(`select cus.*, CD.* from customers as cus INNER JOIN customer_details AS CD
                       ON cus.customer_mobile_number = CD.customer_mobile_number where cus.customer_mobile_number = ${customer_mobile_number}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                return res.status(200).json({ success: true, message: "success", error: "0", update_location_address: result });
                            })
                    }
                })
            } else {
                return res.status(200).json({ success: true, message: "user not found", error: "1" });
            }
        })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}



function sendUserOTP(phone) {
    return sendOtp(phone, "91");
}

function verifyUserOTP(phone, otp) {
    return verifyOtp(phone, otp, "91");
}