const connection = require('../database/db');
const jwt = require('jsonwebtoken');
const config = require('../config');


exports.registerNewCustomer = (req, res) => {
    const data = req.body;
    tag = data.tag;
    dealer_id = data.dealer_id;
    customer_first_name = data.customer_first_name;
    customer_last_name = data.customer_last_name;
    customer_mobile_number = data.customer_mobile_number;
    customer_email_id = data.customer_email_id;
    customer_image = "false";
    customer_saved_address = data.customer_saved_address;
    vehicle_registration_number = data.vehicle_registration_number;
    vehicle_purchased_date = data.vehicle_purchased_date;
    customer_vehicle_number = data.customer_vehicle_number;
    vehicle_model_id = data.vehicle_model_id;
    status = data.status
    if (tag == 'registerNewCustomer') {
        connection.query(`select * from dealers where dealer_id = ?`, [dealer_id], (err, rows) => {
            if (err) {
                return res.send(err)
            }
            if (rows) {
                connection.query(`insert into customers (dealer_id, customer_first_name, customer_last_name, customer_mobile_number, customer_email_id, customer_image, customer_saved_address) values(?,?,?,?,?,?,?)`, [rows[0].dealer_id, customer_first_name, customer_last_name, customer_mobile_number, customer_email_id, customer_image, customer_saved_address], (err, customer) => {
                    if (err) {
                        return res.send(err)
                    }
                    if (customer) {
                        connection.query(`select * from vehicle_model where vehicle_model_id = ?`, [vehicle_model_id], (err, rows) => {
                            if (err) {
                                return res.send(err)
                            }
                            if (rows) {
                                connection.query(`insert into vehicle_details (vehicle_model_id, vehicle_registration_number, vehicle_purchased_date) values(?,?,?)`, [rows[0].vehicle_model_id, vehicle_registration_number, vehicle_purchased_date], (err, vehicle) => {
                                    if (err) {
                                        return res.send(err)
                                    }
                                    if (vehicle) {
                                        connection.query(`insert into customer_vehicle (customer_id, vehicle_detail_id, customer_vehicle_number, status) values(?,?,?,?)`, [customer.insertId, vehicle.insertId, customer_vehicle_number, status], (err, rows) => {

                                            if (rows) {
                                                sql = `SELECT cus.*, cusv.*, VD.* FROM customers AS cus INNER JOIN customer_vehicle AS cusv ON cus.customer_id = cusv.customer_id INNER JOIN

                                                   vehicle_details AS VD ON cusv.vehicle_detail_id = VD.vehicle_detail_id WHERE cus.customer_id = ?`;
                                                connection.query(sql, [customer.insertId], (err, rows) => {
                                                    return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.newCustomerProfile = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_id = data.customer_id;
    if (tag == 'newCustomerProfile') {
        sql = `SELECT CUS.*,CUSV.*,VDTL.*,VFS.*,VPS.*,VM.*,VMN.* FROM customers AS CUS INNER JOIN customer_vehicle AS CUSV ON CUS.customer_id = CUSV.customer_id
               INNER JOIN vehicle_details AS VDTL ON CUSV.vehicle_detail_id = VDTL.vehicle_detail_id
               INNER JOIN vehicle_free_service_details AS VFS ON VDTL.vehicle_model_id = VFS.vehicle_model_id
               INNER JOIN vehicle_paid_service_details AS VPS ON VDTL.vehicle_model_id = VPS.vehicle_model_id
               INNER JOIN vehicle_model AS VM ON VPS.vehicle_model_id = VM.vehicle_model_id
               INNER JOIN vehicle_manufacturer AS VMN ON VM.vehicle_manufacturer_id = VMN.vehicle_manufacturer_id
               where CUS.customer_id = ?`
        connection.query(sql, [customer_id], (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.newCustomerUpdateProfile = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_first_name = data.customer_first_name;
    customer_last_name = data.customer_last_name;
    customer_mobile_number = data.customer_mobile_number;
    customer_email_id = data.customer_email_id;
    customer_saved_address = data.customer_saved_address;
    customer_id = data.customer_id;
    vehicle_model_id = data.vehicle_model_id;
    vehicle_model_name = data.vehicle_model_name;
    vehicle_detail_id = data.vehicle_detail_id;
    vehicle_registration_number = data.vehicle_registration_number;
    vehicle_purchased_date = data.vehicle_purchased_date;
    if (tag == 'newCustomerUpdateProfile') {
        sql = `update customers set customer_first_name = ?, customer_last_name = ?, customer_mobile_number= ?, customer_email_id = ?, customer_saved_address = ? where customer_id = ?`
        connection.query(sql, [customer_first_name, customer_last_name, customer_mobile_number, customer_email_id, customer_saved_address, customer_id], (err, rows) => {
            if (err) {
                console.log(err);
            } if (rows) {
                sql = `update vehicle_model set vehicle_model_name = ? where vehicle_model_id = ?`
                connection.query(sql, [vehicle_model_name, vehicle_model_id], (err, rows) => {
                    if (err) {
                        console.log(err);
                    } if (rows) {
                        sql = `update vehicle_details set vehicle_registration_number = ?, vehicle_purchased_date = ? where vehicle_detail_id = ?`;
                        connection.query(sql, [vehicle_registration_number, vehicle_purchased_date, vehicle_detail_id], (err, rows) => {
                            if (err) {
                                console.log(err);
                            } if (rows) {
                                connection.query(`select * from customers where customer_id = ?`, [customer_id], (err, rows) => {

                                    return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                                })
                            }
                        })
                    }
                })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.deleteNewCustomer = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_id = data.customer_id;
    if (tag == 'deleteNewCustomer') {
        connection.query(`delete from customers where customer_id = ?`, [customer_id], (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchAllNewCustomer = (req, res) => {
    const data = req.body;
    tag = data.tag;
    if (tag == 'fetchAllNewCustomer') {
        var numRows;
        var numPerPage = parseInt(req.body.limit, 10) || 1;
        var page = parseInt(req.body.offset, 10) || 0;
        var numPages;
        var skip = page * numPerPage;
        sql1 = `SELECT count(*) as numRows FROM customers AS CUS INNER JOIN customer_vehicle AS CUSV ON CUS.customer_id = CUSV.customer_id
                INNER JOIN vehicle_details AS VDTL ON CUSV.vehicle_detail_id = VDTL.vehicle_detail_id
                INNER JOIN vehicle_free_service_details AS VFS ON VDTL.vehicle_model_id = VFS.vehicle_model_id
                INNER JOIN vehicle_paid_service_details AS VPS ON VDTL.vehicle_model_id = VPS.vehicle_model_id
                INNER JOIN vehicle_model AS VM ON VPS.vehicle_model_id = VM.vehicle_model_id
                INNER JOIN vehicle_manufacturer AS VMN ON VM.vehicle_manufacturer_id = VMN.vehicle_manufacturer_id `
        var limit = skip + ',' + numPerPage;
        connection.query(sql1, (err, results) => {
            if (err) {
                console.log(err);
            } if (results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                sql = `SELECT CUS.*,CUSV.*,VDTL.*,VFS.*,VPS.*,VM.*,VMN.* FROM customers AS CUS INNER JOIN customer_vehicle AS CUSV ON CUS.customer_id = CUSV.customer_id
                INNER JOIN vehicle_details AS VDTL ON CUSV.vehicle_detail_id = VDTL.vehicle_detail_id
                INNER JOIN vehicle_free_service_details AS VFS ON VDTL.vehicle_model_id = VFS.vehicle_model_id
                INNER JOIN vehicle_paid_service_details AS VPS ON VDTL.vehicle_model_id = VPS.vehicle_model_id
                INNER JOIN vehicle_model AS VM ON VPS.vehicle_model_id = VM.vehicle_model_id
                INNER JOIN vehicle_manufacturer AS VMN ON VM.vehicle_manufacturer_id = VMN.vehicle_manufacturer_id ORDER BY VDTL.vehicle_purchased_date DESC LIMIT ${limit}`
                connection.query(sql, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    var responsePayload = {
                        results: results
                    };
                    if (page < numPages) {
                        responsePayload.pagination = {
                            current: page,
                            perPage: numPerPage,
                            count: numRows,
                            pages: numPages
                        }
                    }
                    else responsePayload.pagination = {
                        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
                    }
                    return res.status(200).json({ status: "true", message: "success", error: "0", results: responsePayload })
                })

            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.searchCustomers = (req, res) => {
    const data = req.body;
    tag = data.tag;
    customer_first_name = data.customer_first_name;
    if (tag == 'searchCustomers') {
        sql = `SELECT CUS.*,CUSV.*,VDTL.*,VFS.*,VPS.*,VM.*,VMN.* FROM customers AS CUS INNER JOIN customer_vehicle AS CUSV ON CUS.customer_id = CUSV.customer_id
               INNER JOIN vehicle_details AS VDTL ON CUSV.vehicle_detail_id = VDTL.vehicle_detail_id
               INNER JOIN vehicle_free_service_details AS VFS ON VDTL.vehicle_model_id = VFS.vehicle_model_id
               INNER JOIN vehicle_paid_service_details AS VPS ON VDTL.vehicle_model_id = VPS.vehicle_model_id
               INNER JOIN vehicle_model AS VM ON VPS.vehicle_model_id = VM.vehicle_model_id
               INNER JOIN vehicle_manufacturer AS VMN ON VM.vehicle_manufacturer_id = VMN.vehicle_manufacturer_id WHERE`
        if (customer_first_name !== undefined && customer_first_name != null) {
            sql += " CUS.customer_first_name LIKE '%" + customer_first_name + "%' OR CUS.customer_mobile_number LIKE '%" + customer_first_name + "%'";
        }
        connection.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.uploadCustomerImage = (req, res) => {
    customer_id = req.body.customer_id;
    customer_image = req.files[0].path;
    connection.query(`update customers set customer_image = ? where customer_id = ?`, [customer_image, customer_id], (err, result) => {
        if (err) {
            console.error(err)
        }
        if (result) {
            connection.query(`select customer_image from customers where customer_id = ?`, [customer_id], (err, result) => {
                if (err) {
                    console.error(err);
                }
                if (result) {
                    var image = result.customer_image;
                    result.customer_image = image.split('/').slice(1).join('/')
                    return res.status(200).json({ status: "true", message: "success", error: "0", rows: result })
                }
            })
        }
    })
}
