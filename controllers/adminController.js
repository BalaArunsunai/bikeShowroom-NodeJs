const connection = require('../database/db');
const bcrypt = require('bcrypt');
const config = require('../config');

exports.registerDealer = (req, res) => {

    const data = req.body;
    var dealer_id, manufacture_id, vehicle_service_center_id;
    if (!data.tag || !data.dealer_first_name || !data.dealer_last_name || !data.dealer_mobile_number || !data.dealer_email_id || !data.dealer_password || !data.admin_id) {
        return res.status(400).json({ status: 'false', message: "invalid payload" })
    }
    connection.beginTransaction(function (err) {
        if (err) {
            throw err;
        }
        var uuid = "IDSA" + Math.floor(Math.random()*899999+100000);
        tag = data.tag;
        dealer_first_name = data.dealer_first_name;
        dealer_last_name = data.dealer_last_name;
        dealer_mobile_number = data.dealer_mobile_number;
        dealer_email_id = data.dealer_email_id;
        admin_id = data.admin_id;
        dealer_unique_id = uuid
        dealer_password = bcrypt.hashSync(data.dealer_password, 10);
        dealer_type = "Admin";
        dealer_image = "test";
        if (tag == 'registerDealer') {
            connection.query('SELECT * from dealers where dealer_email_id = ?', [dealer_email_id], (err, rows) => {
                if (!rows.length > 0) {
                    connection.query(`INSERT INTO  dealers (admin_id,dealer_unique_id,dealer_first_name,dealer_last_name,dealer_password,dealer_mobile_number,dealer_email_id, dealer_type,dealer_image) values (?,?,?,?,?,?,?,?,?)`, [admin_id, dealer_unique_id, dealer_first_name, dealer_last_name, dealer_password, dealer_mobile_number, dealer_email_id, dealer_type, dealer_image], (err, rows) => {
                        if (err) {
                            return connection.rollback(function () {
                                throw err;
                            });
                        }
                        else {
                            if (rows) {
                                dealer_id = rows.insertId
                                vehicle_service_center_name = data.vehicle_service_center_name;
                                vehicle_service_center_email_id = data.vehicle_service_center_email_id;
                                vehicle_service_center_city = data.vehicle_service_center_city,
                                vehicle_service_center_area = data.vehicle_service_center_area
                                vehicle_service_center_gst_no = data.vehicle_service_center_gst_no
                                vehicle_service_center_address = data.vehicle_service_center_address
                                connection.query(`Insert into vehicle_service_center (dealer_id,vehicle_service_center_name, vehicle_service_center_email_id, vehicle_service_center_city, vehicle_service_center_area, vehicle_service_center_gst_no, vehicle_service_center_address) values (?,?,?,?,?,?,?)`,
                                    [dealer_id, vehicle_service_center_name, vehicle_service_center_email_id, vehicle_service_center_city, vehicle_service_center_area, vehicle_service_center_gst_no, vehicle_service_center_address], (err, rows) => {
                                        if (err) {
                                            return connection.rollback(function () {
                                                throw err;
                                            });
                                        } else if (rows) {
                                            vehicle_service_center_id = rows.insertId;
                                            vehicle_manufacturer_name = data.vehicle_manufacturer_name;
                                            connection.query(`Insert into vehicle_manufacturer (vehicle_service_center_id, vehicle_manufacturer_name ) values(?, ?)`, [vehicle_service_center_id, vehicle_manufacturer_name], (err, rows) => {
                                                if (err) {
                                                    return connection.rollback(function () {
                                                        throw err;
                                                    });
                                                } else {
                                                    manufacture_id = rows.insertId
                                                    connection.query(`SELECT  D.*, VCC.*, VM.*
                                                    FROM
                                                       dealers AS D
                                                    INNER JOIN vehicle_service_center AS VCC
                                                    ON
                                                       D.dealer_id = VCC.dealer_id
                                                    INNER JOIN vehicle_manufacturer AS VM
                                                    ON
                                                       VCC.vehicle_service_center_id = VM.vehicle_service_center_id
                                                       
                                                      AND
                                                      d.dealer_id = ?
                                                      AND
                                                      VCC.vehicle_service_center_id= ?
                                                      AND
                                                    VM.vehicle_manufacturer_id = ?`,
                                                        [dealer_id, vehicle_service_center_id, manufacture_id], (err, rows) => {
                                                            connection.commit(function (err) {
                                                                console.log('Commiting transaction.....');
                                                                if (err) {
                                                                    return connection.rollback(function () {
                                                                        throw err;
                                                                    });
                                                                }
                                                                console.log('Transaction Complete.');
                                                                connection.end();
                                                            });
                                                            return res.status(200).json({ status: "true", message: "success", error: "0", rows })

                                                        });

                                                }
                                            });
                                        }
                                    });
                            }
                        }
                    });
                }
                else {
                    return res.status(400).json({ status: 'false', error: "1", message: `user already exist!` })
                }
            });
        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    });
}

exports.updateAdvertisement = (req, res) => {
    try {
        const data = req.body;
        admin_id = data.admin_id;
        advertisement_id = data.advertisement_id;
        status = 'Active';
        tag = data.tag;
        if (tag == 'updateAdvertisement') {
            connection.query(`select * from admin where admin_id = ?`, [admin_id], (err, admin) => {
                if (admin) {
                    connection.query(`select * from advertisement where advertisement_id = ?`, [advertisement_id], (err, row) => {
                        if (row[0].status == 'Requested') {
                            connection.query(`update advertisement set status = ? where advertisement_id = ?`, [status, advertisement_id], (err, rows) => {
                                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                            })
                        }
                    })
                }else {
                    return res.status(404).json({ status: 'false', error: "1", message: 'admin not exist!' })
                }
            })
        } else {
            return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
        }
    } catch (error) {
        return res.status(501).json({ status: "false", message: `Error processing your request ${error}`, error: "1" })
    }

}


