const request = require("request");
const config = require("../config");

exports.sendSms = function(mobile, msg, coun) {
    return new Promise((resolve, reject) => {
        const body = `<MESSAGE>
                        <AUTHKEY>${config.authkey}</AUTHKEY>
                        <SENDER>${config.sender}</SENDER>
                        <ROUTE>${config.route}</ROUTE>
                        <COUNTRY>${coun}</COUNTRY>
                        <SMS TEXT="${msg}" >
                            <ADDRESS TO="${mobile}"></ADDRESS>
                        </SMS>
                    </MESSAGE>`;
        request({
            method: 'POST',
            url: 'https://control.msg91.com/api/postsms.php',
            headers: { 'content-type': 'application/xml' },
            body: body
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                resolve(body);
            } else {
                console.log(error);
                reject(error);
            }
        });
    });
};


exports.sendOtp = function(mobile, coun) {
    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            url: `https://control.msg91.com/api/sendotp.php?authkey=${config.Msg91.authkey}&message=Welcome to Eynos, Your verification code is %23%23OTP%23%23.&sender=${config.Msg91.sender}&mobile=${coun}${mobile}&otp_expiry=60`
            
        }, function(error, response, body) {
            // console.log(url);
            console.log(error);
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
                resolve(body);
            } else {
                console.log(error);
                reject(error);
            }
        });
    });
};

exports.verifyOtp = function(mobile, otp, coun) {
    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            url: `https://control.msg91.com/api/verifyRequestOTP.php?authkey=${config.Msg91.authkey}&mobile=${coun}${mobile}&otp=${otp}`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                resolve(JSON.parse(body));
            } else {
                console.log(error);
                reject(error);
            }
        });
    });
};

exports.resendOtp = function(mobile, con){
    return new Promise((resolve,reject)=>{
        request({
            method: 'POST',
            url:`https://control.msg91.com/api/retryotp.php?retrytype=text&mobile=${con}${mobile}&authkey=${config.authkey}`,
            headers: {"content-type": "application/x-www-form-urlencoded"}
            },function(error,response,body){
             if(!error && response.statusCode==200){
                 console.log(body);
                 resolve(JSON.parse(body));
             }else{
                 console.log(error);
                 reject(error)
             }
            });
    });
}