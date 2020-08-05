const connection = require('../database/db');
const jwt = require('jsonwebtoken');
const path = require('path');
const config = require('../config');

exports.CreatePromoForCustomers = (req, res) => {
    try {
        const data = req.body;
        tag = data.tag;
        promo_code_detail = data.promo_code_detail;
        promo_code_duration = data.promo_code_duration;
        promo_code_send_date = data.promo_code_send_date;
        number_of_customers = data.number_of_customers;
        promo_availed = data.promo_availed;
        promo_status = 'Inactive';
        promo_code_image = req.files[0].path;
        if (tag == 'CreatePromoForCustomers') {
            connection.query(`insert into promo_code (promo_code_image,promo_code_detail, promo_code_duration, promo_code_send_date, number_of_customers, promo_availed, promo_status) values(?,?,?,?,?,?,?)`, [promo_code_image, promo_code_detail, promo_code_duration, promo_code_send_date, number_of_customers, promo_availed, promo_status], (err, rows) => {
                if (rows) {
                    connection.query(`select * from promo_code where promo_code_id = ?`, [rows.insertId], (err, rows) => {
                        if (rows) {
                            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                        }
                    })
                }
            })

        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    } catch (error) {
        return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${error}` })
    }

}

exports.deletePromo = (req, res) => {
    const data = req.body;
    tag = data.tag;
    promo_code_id = data.promo_code_id;
    if (tag == 'deletePromo') {
        connection.query(`delete from promo_code where promo_code_id = ?`, [promo_code_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            }
            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchAllPromo = (req, res) => {
    const data = req.body;
    tag = data.tag
    if (tag == 'fetchAllPromo') {
        connection.query(`select * from promo_code`, (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            }
            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.editPromo = (req, res) => {
    const data = req.body;
    promo_code_detail = data.promo_code_detail;
    promo_code_duration = data.promo_code_duration;
    number_of_customers = data.number_of_customers;
    promo_code_id = data.promo_code_id;
    tag = data.tag;
    if (tag == 'editPromo') {
        connection.query(`update promo_code set promo_code_detail = ?, promo_code_duration = ?, number_of_customers = ? where promo_code_id = ?`, [promo_code_detail, promo_code_duration, number_of_customers, promo_code_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.updatePromoStatus = (req, res) => {
    const data = req.body;
    tag = data.tag;
    promo_status = 'Active';
    promo_code_id = data.promo_code_id;
    if (tag == 'updatePromoStatus') {
        connection.query(`update promo_code set promo_status = ? where promo_code_id = ?`, [promo_status, promo_code_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.addCustomerPromoCodeList = (req, res) => {
    try {
        const data = req.body
        data.forEach((result) => {
            tag = result.tag;
            name = result.name;
            promo_code_id = result.promo_code_id;
            vehicle_no = result.vehicle_no;
            model = result.model;
            service_type = result.service_type;
            next_service_date = result.next_service_date;
            if (tag == 'addCustomerPromoCodeList' && promo_code_id != undefined) {
                connection.query(`select * from promo_code where promo_code_id = ?`, [promo_code_id], (err, prom) => {
                    if (err) {
                        return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${error}` })
                    }
                    if (prom) {
                        sql = `insert into customer_promo_code_list (promo_code_id, name, vehicle_no, model, service_type, next_service_date) values(?,?,?,?,?,?)`
                        connection.query(sql, [prom[0].promo_code_id, name, vehicle_no, model, service_type, next_service_date], (err, rows) => {
                            if (err) {
                                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${error}` })
                            }
                            if (rows) {
                                connection.query(`select * from customer_promo_code_list where promo_code_id = ?`, [prom[0].promo_code_id], (err, rslt) => {
                                    if (err) {
                                        return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${error}` })
                                    }
                                    res.end(JSON.stringify({ status: "true", message: "success", error: "0", rslt }));
                                })
                            }
                        })

                    }
                })
            } else {
                return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
            }
        })
    } catch (error) {
        return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${error}` })
    }
}

exports.fetchCustomerPromoCodeList = (req, res) => {
    data = req.body;
    tag = data.tag;
    promo_code_id = data.promo_code_id;
    if (tag == 'fetchCustomerPromoCodeList') {
        connection.query(`select * from customer_promo_code_list where promo_code_id = ?`, [promo_code_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${error}` })
            }
            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(404).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.filterPromoCodeList = (req, res) => {
    const data = req.body;
    tag = data.tag;
    next_service_date = data.next_service_date
    if (tag == 'filterPromoCodeList') {
        sql = `SELECT * FROM customer_promo_code_list WHERE next_service_date = ?
               ORDER BY name`
        connection.query(sql, [next_service_date], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: 'false', error: "1", message: `Error processing your request${err}` })
            }
            return res.status(200).json({ status: "true", message: "success", error: "0", rows })
        })
    } else {
        return res.status(404).json({ status: 'false', error: "1", message: 'invalid request' })
    }
} 