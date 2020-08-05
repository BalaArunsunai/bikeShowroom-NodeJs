const connection = require('../database/db');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const sendmail = require('../lib/sendMail').sendMail


exports.createDealerAdvertisement = (req, res) => {
    try {
        const data = req.body;
        tag = data.tag;
        dealer_id = data.dealer_id;
        customers = data.customers;
        start_date = data.start_date;
        end_date = data.end_date;
        send_date = data.send_date;
        status = 'Requested';
        link_description = data.link_description;
        advertisement_image = req.files[0].filename;
        if (tag == 'createDealerAdvertisement') {
            connection.query(`select * from dealers where dealer_id = ?`, [dealer_id], (err, dealer) => {
                if (dealer) {
                    connection.query(`insert into advertisement (dealer_id, customers, start_date, end_date, send_date, status, link_description, advertisement_image) values(?,?,?,?,?,?,?,?)`, [dealer_id, customers, start_date, end_date, send_date, status, link_description, advertisement_image], (err, rows) => {
                        if (rows) {
                            connection.query(`select * from advertisement where advertisement_id = ?`, [rows.insertId], (err, rows) => {
                                sendmail('mamptl123@gmail.com')
                                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                            })
                        }
                    })
                }
            })
        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    } catch (error) {
        return res.status(501).json({ status: "false", message: "Error processing your request", error: "1" })
    }
}

exports.editDealerAdvertisement = (req, res) => {
    try {
        const data = req.body;
        tag = data.tag;
        dealer_id = data.dealer_id;
        advertisement_id = data.advertisement_id;
        customers = data.customers;
        start_date = data.start_date;
        end_date = data.end_date;
        link_description = data.link_description;
        advertisement_image = req.files[0].path;
        if (tag === 'editDealerAdvertisement') {
            connection.query(`select * from dealers where dealer_id = ?`, [dealer_id], (err, rows) => {
                if (rows) {
                    connection.query(`update advertisement set customers = ?, start_date = ?, end_date = ?, link_description = ?, advertisement_image = ? where advertisement_id = ? AND dealer_id = ?`, [customers, start_date, end_date, link_description, advertisement_image, advertisement_id, dealer_id], (err, rows) => {
                        return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                    })
                }
            })
        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }

    } catch (error) {
        return res.status(501).json({ status: "false", message: "Error processing your request", error: "1" })
    }
}

exports.deleteDealerAdvertisement = (req, res) => {
    try {
        const data = req.body;
        tag = data.tag;
        dealer_id = data.dealer_id;
        advertisement_id = data.advertisement_id;
        if (tag === 'deleteDealerAdvertisement') {
            connection.query(`select * from dealers where dealer_id = ?`, [dealer_id], (err, rows) => {
                if (rows) {
                    connection.query(`delete from advertisement where advertisement_id = ? AND dealer_id = ?`, [advertisement_id, dealer_id], (err, rows) => {
                        return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                    })
                }
            })
        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    } catch (error) {
        return res.status(501).json({ status: "false", message: "Error processing your request", error: "1" })
    }
}

exports.fetchDealerAdvertisement = (req, res) => {
    try {
        const data = req.body;
        tag = data.tag;
        dealer_id = data.dealer_id;
        advertisement_id = data.advertisement_id;
        if (tag === 'fetchDealerAdvertisement') {
            connection.query(`select * from dealers where dealer_id = ?`, [dealer_id], (err, rows) => {
                if (rows) {
                    connection.query(`select * from advertisement where advertisement_id = ? AND dealer_id = ?`, [advertisement_id, dealer_id], (err, rows) => {
                        return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                    })
                }
            })
        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    } catch (error) {
        return res.status(501).json({ status: "false", message: "Error processing your request", error: "1" })
    }
}

exports.fetchAllDealerAdvertisement = (req, res) => {
    try {
        const data = req.body;
        tag = data.tag;
        dealer_id = data.dealer_id;
        if (tag === 'fetchAllDealerAdvertisement') {
            connection.query(`select * from dealers where dealer_id = ?`, [dealer_id], (err, rows) => {
                if (rows) {
                    connection.query(`select * from advertisement`, (err, rows) => {
                        return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                    })
                }
            })
        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    } catch (error) {
        return res.status(501).json({ status: "false", message: "Error processing your request", error: "1" })
    }
}

exports.fetchImage = (req, res) => {
    fs.stat(path.resolve(`${config.server.path}image/advertisement/${req.params.detail}`), function (err) {
        if (err) {
            logger.log({ level: 'error', message: `Error processing request:${err}` });
            return res.status(401).json({ success: false, message: `Error processing your request${err}` });
        }
        res.sendFile(path.resolve(`${config.server.path}image/advertisement/${req.params.detail}`));
    });

}