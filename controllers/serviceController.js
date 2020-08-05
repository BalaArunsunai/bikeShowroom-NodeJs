const connection = require('../database/db');
const uniqid = require('uniqid');

exports.uploadServiceBookingRequest = (req, res) => {
    const data = req.body;
    tag = data.tag;
    vehicle_model_id = data.vehicle_model_id;
    customer_vehicle_id = data.customer_vehicle_id;
    specified_service_name = data.specified_service_name;
    service_booking_date = new Date();
    service_booking_time = new Date();
    serviceId = uniqid('SRID-').match(/.{1,6}/g).join('-');
    service_track_status = 'InProgress';
    if (tag = 'uploadServiceBookingRequest') {
        connection.query(`insert into service_booking_request (vehicle_model_id, customer_vehicle_id, specified_service_name, service_booking_date, service_booking_time, serviceId) values(?,?,?,?,?,?)`, [vehicle_model_id, customer_vehicle_id, specified_service_name, service_booking_date, service_booking_time, serviceId], (err, uploaded) => {
            if (err) {
                return res.send(err)
            } if (uploaded) {
                connection.query(`insert into service_tracker (service_booking_id, service_track_status) values(?,?)`, [uploaded.insertId, service_track_status], (err, rows) => {
                    if (err) {
                        return res.send(err)
                    } if (rows) {
                        sql = `SELECT sbr.*,cv.customer_vehicle_number, st.service_track_status,st.service_tracker_id,vm.vehicle_model_name from service_booking_request as sbr INNER JOIN service_tracker as st 
                        ON sbr.service_booking_id = st.service_booking_id INNER JOIN vehicle_model as vm 
                        ON sbr.vehicle_model_id = vm.vehicle_model_id INNER JOIN customer_vehicle as cv 
                        ON sbr.customer_vehicle_id=cv.customer_vehicle_id where sbr.service_booking_id = ?`
                        connection.query(sql, [uploaded.insertId], (err, result) => {
                            if (err) {
                                return res.send(err)
                            }
                            return res.status(200).json({ status: "true", message: "success", error: "0", result })
                        })
                    }
                })
            }
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchAllServiceBookingRequest = (req, res) => {
    tag = req.body.tag;
    if (tag == 'fetchAllServiceBookingRequest') {
        sql = `SELECT sbr.*,cv.customer_vehicle_number, st.service_track_status,st.service_tracker_id,vm.vehicle_model_name from service_booking_request as sbr INNER JOIN service_tracker as st 
    ON sbr.service_booking_id = st.service_booking_id INNER JOIN vehicle_model as vm 
    ON sbr.vehicle_model_id = vm.vehicle_model_id INNER JOIN customer_vehicle as cv 
    ON sbr.customer_vehicle_id=cv.customer_vehicle_id ORDER BY sbr.service_booking_date ASC`
        connection.query(sql, (err, result) => {
            return res.status(200).json({ status: "true", message: "success", error: "0", result })
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.searchOnServiceBookingRequest = (req, res) => {
    tag = req.body.tag;
    search = req.body.search
    if (tag == 'searchOnServiceBookingRequest') {
        sql = "SELECT sbr.*,cv.customer_vehicle_number, st.service_track_status,st.service_tracker_id,vm.vehicle_model_name from service_booking_request as sbr INNER JOIN service_tracker as st \
        ON sbr.service_booking_id = st.service_booking_id INNER JOIN vehicle_model as vm \
        ON sbr.vehicle_model_id = vm.vehicle_model_id INNER JOIN customer_vehicle as cv \
        ON sbr.customer_vehicle_id=cv.customer_vehicle_id WHERE cv.customer_vehicle_number LIKE '%" + search + "%' or sbr.serviceId LIKE '%" + search + "%'"
        connection.query(sql, (err, result) => {
            return res.status(200).json({ status: "true", message: "success", error: "0", result })
        })
    } else {
        return res.status(401).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}