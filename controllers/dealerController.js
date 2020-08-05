const connection = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const path = require('path');

exports.dealerLogin = (req, res) => {
    const data = req.body;
    dealer_email_id = data.dealer_email_id;
    dealer_password = data.dealer_password;
    tag = data.tag;
    if (tag == 'registerDealer') {
        connection.query(`SELECT * from dealers where dealer_email_id = ?`, [dealer_email_id], (err, rows) => {
            if (rows != "") {
                bcrypt.compare(dealer_password, rows[0].dealer_password, (err, result) => {
                    if (err) {
                        throw err;
                    } if (result) {
                        let data = {
                            "password": rows[0].dealer_password,
                            "email": rows[0].dealer_email_id,
                            "id": rows[0].dealer_id

                        }
                        var now = Math.floor(Date.now() / 1000),
                            iat = (now - 10),
                            jwtId = Math.random().toString(36).substring(7);
                        var payload = {
                            iat: iat,
                            jwtid: jwtId,
                            audience: 'TEST',
                            data: data
                        }
                        jwt.sign(payload, config.tokenInfo.secreteKey, { algorithm: 'HS256' }, (err, token) => {
                            if (err) {
                                return false;
                            }
                            return res.status(200).json({ status: "true", message: "success", token });
                        })
                    } else {
                        return res.status(200).json({ status: 'false', error: "1", message: 'wrong password!' })
                    }
                })

            } else if (rows == false) {
                return res.status(401).json({ status: 'false', error: "1", message: 'please check above details' })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.dealerProfile = (req, res) => {
    token = jwt.verify(req.token, config.tokenInfo.secreteKey)
    userId = token.data.id;
    const data = req.body;
    tag = data.tag;
    if (tag == "dealerProfile") {
        connection.query(`SELECT * from dealers where dealer_id = ?`, [userId], (err, result) => {
            if (result != "") {
                return res.status(200).json({ status: "true", message: "success", error: "0", result })
            } else {
                return res.status(401).json({ status: "false", message: "dealer not found", error: "1" })
            }
        })
    }
}

exports.dealerChangePassword = (req, res) => {
    const data = req.body;
    tag = data.tag;
    dealer_id = data.dealer_id;
    dealer_confirm_password = data.dealer_confirm_password;
    dealer_password = data.dealer_password
     if (tag == "dealerChangePassword") {
    if(dealer_password==dealer_confirm_password){
      dealer_password = bcrypt.hashSync(data.dealer_password, 10);
        var sql = `SELECT * from dealers where dealer_id =${dealer_id}`;
           connection.query(sql, (err, rows)=>{
             if(rows){
               connection.query(`update dealers set dealer_password =? where dealer_id=?`, [dealer_password, dealer_id], (err, result) => {
                                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                            })
             } else {
                    return res.status(401).json({ status: "false", message: "dealer not found", error: "1" })
                }
           })
    } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'password does not match!' })
    }
  } else {
        return res.status(200).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}


exports.dealerForgetPassword = (req, res) => {
    jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.body;
    tag = data.tag;
    dealer_email_id = data.dealer_email_id;
    if (tag == 'dealerForgetPassword') {
        connection.query(`SELECT * from dealers where dealer_email_id=?`, [dealer_email_id], (err, rows) => {
            if (rows != null) {
                let password = Math.random().toString(36).slice(-7);
                console.log(password);
                let newpass = bcrypt.hashSync(password, 10);
                connection.query(`update dealers set dealer_password = ? where dealer_email_id = ?`, [newpass, dealer_email_id], (err, result) => {
                    if (!err) {
                        return res.status(200).json({ status: "true", message: "success", error: "0", result })
                    }
                })
            } else {
                return res.status(401).json({ status: "false", message: "dealer not found", error: "1" })
            }
        })
    }
}

exports.editDealerServiceCenterDetails = (req, res) => {
    const data = req.body;
    dealer_id = data.dealer_id;
    tag = data.tag;
    service_limit_per_day = data.service_limit_per_day;
    pickup_distance = data.pickup_distance;
    emergency_mobile_number = data.emergency_mobile_number;
    service_holiday_year = data.service_holiday_year;
    service_holiday_week_off = data.service_holiday_week_off;
    staff_name = data.staff_name;
    role = data.role;
    if (tag == "editDealerServiceCenterDetails") {
        connection.query(`select *  from dealers where dealer_id = ?`, [dealer_id], (err, rows) => {
            if (rows.length !== null) {
                connection.query(`update vehicle_service_center set service_limit_per_day = ?, pickup_distance = ?  where dealer_id=?`, [service_limit_per_day, pickup_distance, dealer_id], (err, rows) => {
                    if (rows.length !== null) {
                        connection.query(`INSERT INTO  emergency_contacts (dealer_id, staff_name, emergency_mobile_number, role) values (?,?,?,?)`, [dealer_id, staff_name, emergency_mobile_number, role], (err, rows) => {
                            if (rows) {
                                connection.query(`INSERT INTO  service_holidays (dealer_id, service_holiday_year,service_holiday_week_off) values (?,?,?)`, [dealer_id, service_holiday_year, service_holiday_week_off], (err, rows) => {
                                    if (rows) {
                                        connection.query(`SELECT  VCC.*, EC.*,SH.*,D.*
                                                          FROM
                                                          vehicle_service_center AS VCC
                                                          INNER JOIN emergency_contacts AS EC
                                                          ON
                                                          VCC.dealer_id = EC.dealer_id
                                                          INNER JOIN service_holidays AS EC
                                                          ON
                                                          VCC.dealer_id = VM.dealer_id
                                                          AND
                                                          D.dealer_id = ?`, [dealer_id], (err, result) => {
                                                return res.send(result);
                                            })
                                    }
                                })
                            }
                        });
                    }
                })
            }

        });
    }
}

exports.viewHolidays = (req, res) => {
    const data = req.body;
    tag = data.tag;
    dealer_id = data.dealer_id;
    if (tag == 'viewHolidays') {
        connection.query(`select * from service_holidays where dealer_id = ?`, [dealer_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: "Error processing your request", error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
}

exports.updateDealerEmergencyContacts = (req, res) => {
    const data = req.body;
    tag = data.tag;
    dealer_id = data.dealer_id;
    role = data.role;
    emergency_mobile_number = data.emergency_mobile_number;
    if (tag == 'updateEmergencyContacts') {
        connection.query(`update emergency_contacts set emergency_mobile_number = ? where dealer_id = ? and role = ?`, [emergency_mobile_number, dealer_id, role], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: "Error processing your request", error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.deleteDealerEmergencyContacts = (req, res) => {
    const data = req.body;
    tag = data.tag;
    dealer_id = data.dealer_id;
    role = data.role;
    if (tag == 'deleteDealerEmergencyContacts') {
        connection.query(`delete from emergency_contacts where dealer_id = ? and role = ?`, [dealer_id, role], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }

}

exports.editServiceCenterDetails = (req, res) => {
    const data = req.body;
    tag = data.tag;
    dealer_id = data.dealer_id;
    vehicle_service_center_address = data.vehicle_service_center_address;
    service_limit_per_day = data.service_limit_per_day;
    pickup_distance = data.pickup_distance;
    if (tag == 'editServieCenterDetails') {
        connection.query(`update vehicle_service_center set vehicle_service_center_address = ?, service_limit_per_day = ?, pickup_distance= ? where dealer_id = ?`, [vehicle_service_center_address, service_limit_per_day, pickup_distance, dealer_id], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.createDealerStaff = (req, res) => {
    const data = req.body;
    dealer_id = data.dealer_id;
    user_type = data.user_type;
    staff_first_name = data.staff_first_name;
    staff_last_name = data.staff_last_name;
    staff_mobile_number = data.staff_mobile_number;
    staff_email_id = data.staff_email_id;
    created_date = new Date();
    status = data.status;
    tag = data.tag;
    if (tag == 'createDealerStaff') {
        connection.query(`select * from dealers where dealer_id = ?`, [dealer_id], (err, rows) => {
            console.log(rows);
            if (rows) {
                connection.query(`insert into dealer_staff (dealer_id, user_type,staff_first_name,staff_last_name,staff_mobile_number,staff_email_id,created_date,status ) values(?,?,?,?,?,?,?,?)`, [dealer_id, user_type, staff_first_name, staff_last_name, staff_mobile_number, staff_email_id, created_date, status], (err, result) => {
                    return res.status(200).json({ status: "true", message: "success", error: "0", rows })
                })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchDealerPerticularStaffDetails = (req, res) => {
    const data = req.body;
    tag = data.tag;
    dealer_staff_id = data.dealer_staff_id;
    if (tag == 'fetchDealerPerticularStaffDetails') {
        connection.query(`select * from dealer_staff where dealer_staff_id = ?`, [dealer_staff_id], (err, rows) => {
            if (err) {
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.fetchDealerAllStaffDetails = (req, res) => {
    const data = req.body;
    tag = data.tag;
    if (tag == 'fetchDealerAllStaffDetails') {
        connection.query(`select * from dealer_staff`, (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.deleteDealerStaff = (req, res) => {
    const data = req.body;
    tag = data.tag;
    if (tag == 'deleteDealerStaff') {
        connection.query(`delete from dealer_staff where dealer_staff_id = ?`, [dealer_staff_id], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.editDealerStaffDetails = (req, res) => {
    const data = req.body;
    tag = data.tag;
    user_type = data.user_type;
    staff_first_name = data.staff_first_name;
    staff_last_name = data.staff_last_name;
    staff_mobile_number = data.staff_mobile_number;
    staff_email_id = data.staff_email_id;
    dealer_staff_id = data.dealer_staff_id;
    if (tag == 'editDealerStaffDetails') {
        connection.query(`update dealer_staff set user_type = ?, staff_first_name = ?, staff_last_name = ?, staff_mobile_number = ?, staff_email_id = ?  where dealer_staff_id = ?`, [user_type, staff_first_name, staff_last_name, staff_mobile_number, staff_email_id, dealer_staff_id], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ status: "false", message: `Error processing your request${err}`, error: "1" })
            } else {
                return res.status(200).json({ status: "true", message: "success", error: "0", rows })
            }
        })
    }
    else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.searchDealerStaff = (req, res) => {
    const data = req.body
    tag = data.tag;
    searchDealer = data.searchDealer;
    if (tag == 'searchDealerStaff') {
        if (searchDealer != undefined && searchDealer != null) {
            sql = " select * from dealer_staff where staff_first_name LIKE '%" + searchDealer + "%' OR staff_mobile_number LIKE '%" + searchDealer + "%' ";
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                }
                return res.status(200).json({ status: "true", message: "success", error: "0", rows: result })
            })

        }
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.deactivateDealerStaff = (req, res) => {
    const data = req.body
    status = 'Inactive';
    dealer_staff_id = data.dealer_staff_id

    if (data.tag == 'deactivateDealerStaff') {
        connection.query(`update dealer_staff set status = ? where dealer_staff_id = ?`, [status, dealer_staff_id], (err, rows) => {
            if (err) {
                console.error(err);
            }
            if (rows) {
                connection.query(`select status from dealer_staff where dealer_staff_id=?`, [dealer_staff_id], (err, result) => {
                    if (err) {
                        console.error(err);
                    }
                    return res.status(200).json({ status: "true", message: "success", error: "0", rows: result })
                })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.activateDealerStaff = (req, res) => {
    const data = req.body
    status = 'Active';
    dealer_staff_id = data.dealer_staff_id

    if (data.tag == 'activateDealerStaff') {
        connection.query(`update dealer_staff set status = ? where dealer_staff_id = ?`, [status, dealer_staff_id], (err, rows) => {
            if (err) {
                console.error(err);
            }
            if (rows) {
                connection.query(`select status from dealer_staff where dealer_staff_id=?`, [dealer_staff_id], (err, result) => {
                    if (err) {
                        console.error(err);
                    }
                    return res.status(200).json({ status: "true", message: "success", error: "0", rows: result })
                })
            }
        })
    } else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.uploadDealerImage = (req, res) => {
    dealer_id = req.body.dealer_id;
    dealer_image = req.files ? req.files[0].path : "false" ;
    if(req.body.tag == 'uploadDealerImage'){
    connection.query(`update dealers set dealer_image = ? where dealer_id = ?`, [dealer_image, dealer_id], (err, result) => {
        if (err) {
            console.error(err)
        }
        if (result) {
            connection.query(`select dealer_image from dealers where dealer_id = ?`, [dealer_id], (err, result) => {
                if (err) {
                    console.error(err);
                }
                if (result) {
                    result[0].dealer_image = result[0].dealer_image.split('/').slice(1).join('/');
                    return res.status(200).json({ status: "true", message: "success", error: "0", rows: result })
                }
            })
        }
    })
}else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}

exports.uploadDealerStaffImage = (req, res) => {
    dealer_staff_id = req.body.dealer_staff_id;
    staff_image = req.files ? req.files[0].path : "false" ;
    if(req.body.tag == 'uploadDealerStaffImage'){
    connection.query(`update dealer_staff set staff_image = ? where dealer_staff_id = ?`, [staff_image, dealer_staff_id], (err, result) => {
        if (err) {
            console.error(err)
        }
        if (result) {
            connection.query(`select staff_image from dealer_staff where dealer_staff_id = ?`, [dealer_staff_id], (err, result) => {
                if (err) {
                    console.error(err);
                }
                if (result) {
                    console.log(result);
                    result[0].staff_image = result[0].staff_image.split('/').slice(1).join('/');
                    return res.status(200).json({ status: "true", message: "success", error: "0", rows: result })
                }
            })
        }
    })
}else {
        return res.status(400).json({ status: 'false', error: "1", message: 'invalid request' })
    }
}