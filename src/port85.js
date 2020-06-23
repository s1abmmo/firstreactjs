var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var mysql = require('mysql');
var dateFormat = require('dateformat');
var path = require('path');
var crypto = require('crypto');
var multer = require('multer');
var fs = require('fs');

function generate_token(length) {
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}
function generate_tripCode(length) {
    //edit the token allowed characters
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

var conn = mysql.createConnection({
    database: 's1abmmo',
    host: "18.140.71.158",
    user: "s1abmmo",
    password: "s1abmmo"
});
conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    conn.query("CREATE TABLE accounts ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(15), password VARCHAR(100),email VARCHAR(100),phone VARCHAR(100), fullname NVARCHAR(50),token VARCHAR(32),currentBalance VARCHAR(10),dateTimeCreated DATETIME,status VARCHAR(1));", function (err, result, fields) {
        if (!err)
            console.log("Create table success !");
        if (err)
            console.log(err.message)
    });
    conn.query("CREATE TABLE marketTrips ( tripId INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, tripCode VARCHAR(6), tripFrom NVARCHAR(1000),tripTo NVARCHAR(1000), departureTime DATETIME,methodOfReceivingMoney VARCHAR(100),rangeOfVehicle VARCHAR(3),priceToBuyNow VARCHAR(100),priceStart VARCHAR(10),priceBidCurrent VARCHAR(100),idLastUserBid VARCHAR(100),endBid VARCHAR(100),pricePlaceBid VARCHAR(100),timeLastBid DATETIME,customerIsFullName NVARCHAR(100),customerIsPhone VARCHAR(15),timeOpenOnMarket DATETIME,guestPrice VARCHAR(10),tripType NVARCHAR(100),idUserPosted VARCHAR(6),dateTimePosted DATETIME);", function (err, result, fields) {
        if (!err)
            console.log("Create table success !");
        if (err)
            console.log(err.message)
    });
    conn.query("CREATE TABLE tripsPending ( tripId INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, tripCode VARCHAR(6), tripFrom NVARCHAR(1000),tripTo NVARCHAR(1000), departureTime DATETIME,methodOfReceivingMoney VARCHAR(100),rangeOfVehicle VARCHAR(3),priceStart VARCHAR(10),customerIsFullName NVARCHAR(100),customerIsPhone VARCHAR(15),timeOpenOnMarket DATETIME,guestPrice VARCHAR(10),priceToSellNow VARCHAR(10),approved VARCHAR(5),tripType NVARCHAR(100),idUserPosted VARCHAR(6),dateTimePosted DATETIME);", function (err, result, fields) {
        if (!err)
            console.log("Create table success !");
        if (err)
            console.log(err.message)
    });
    conn.query("CREATE TABLE transactionHistory ( transactionId INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, transactionAmout INT(10),transactionNote NVARCHAR(100),transactionDateTime DATETIME,accountId VARCHAR(10));", function (err, result, fields) {
        if (!err)
            console.log("Create table History success !");
        if (err)
            console.log(err.message)
    });
    conn.query("CREATE TABLE administratorAccounts ( adminId INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, adminName VARCHAR(100),adminPassword NVARCHAR(100),adminToken VARCHAR(32),datetimeCreated DATETIME,permissionActive VARCHAR(5),permissionBanned VARCHAR(5),permissionAddMoney VARCHAR(5),permissionDeductMoney VARCHAR(5),permissionApproveTrip VARCHAR(5),permissionCancelTrip VARCHAR(5),permissionSuspendTrip VARCHAR(5),permissionEditTrip VARCHAR(5),permissionApproveCar VARCHAR(5),permissionSuspendCar VARCHAR(5));", function (err, result, fields) {
        if (!err)
            console.log("Create table administratorAccounts success !");
        if (err)
            console.log(err.message)
    });
    conn.query("CREATE TABLE cars ( id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, carIsName VARCHAR(100),licensePlate NVARCHAR(20),seat VARCHAR(2),yearOfManufacture VARCHAR(4),status VARCHAR(1),photoLinkRegistrationCar VARCHAR(1000),photoLinkRegistryCar VARCHAR(1000),photoLinkInsuranceCar VARCHAR(1000),photoLinkLeftCar VARCHAR(1000),photoLinkRightCar VARCHAR(1000),photoLinkFrontCar VARCHAR(1000),photoLinkBehindCar VARCHAR(1000),photoLinkDriverIsLicense VARCHAR(1000),photoLinkIdentityCard VARCHAR(1000),dateTimePosted DATETIME);", function (err, result, fields) {
        if (!err)
            console.log("Create table cars success !");
        if (err)
            console.log(err.message)
    });
});

app.get('/login', function (req, res) {
    var user_name = req.param('username');
    var user_password = req.param('password');
    console.log('Check login ' + user_name);
    conn.query("SELECT id,fullname FROM accounts WHERE username = '" + user_name + "' AND password='" + crypto.createHash('sha256').update(user_password).digest('base64') + "';", function (err, result, fields) {
        if (err) throw err;
        console.log(' ' + result.length);
        if (result.length > 0) {
            var id = result[0].id;
            var fullname = result[0].fullname;
            var token = generate_token(32);

            conn.query("UPDATE accounts SET token='" + token + "' WHERE username=" + user_name + ";", function (err, result, fields) {
                if (err) throw err;

                var obj = {
                    status: "OK",
                    message: "Đăng nhập thành công",
                    id: id.toString(),
                    fullname: fullname,
                    token: token,
                }
                console.log(JSON.stringify(obj));
                res.send(JSON.stringify(obj));
            });
        } else {

            var obj = {
                status: "ERROR",
                message: "Sai tên đăng nhập hoặc mật khẩu",
                token: ""
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));

        }
    });
});

async function CheckAuthentication(user_id, user_name, token) {
    // console.log('Check token ' + user_name);
    // var tokenlive = false;
    // conn.query("SELECT id,username,token FROM accounts WHERE id = '" + user_id + "';", await function (err, resultAuthentication, fields) {
    //     if (err) throw err;
    //     console.log(' ' + resultAuthentication.length);
    //     if (resultAuthentication.length > 0) {
    //         if (user_name == resultAuthentication[0].username && token == resultAuthentication[0].token && token != null && token != "") {
    //             tokenlive = true;
    //         }
    //     }
    //     console.log(tokenlive);
    //     return tokenlive;
    // });

    return new Promise(function (resolve, reject) {
        console.log('Check token ' + user_name);
        var tokenlive = false;
        conn.query("SELECT id,username,token FROM accounts WHERE id='" + user_id + "';", function (err, resultAuthentication, fields) {
            if (err) throw err;
            console.log(' ' + resultAuthentication.length);
            if (resultAuthentication.length > 0) {
                if (user_name == resultAuthentication[0].username && token == resultAuthentication[0].token && token != null && token != "") {
                    tokenlive = true;
                }
            }
            console.log(tokenlive);
            resolve(tokenlive);
        });
    })
}

async function CheckAuthenticationAdmin(adminId, adminName, adminToken, permission) {
    return new Promise(function (resolve, reject) {
        console.log('Check token Admin:' + adminId + " " + adminName + " " + adminToken);
        var tokenlive = false;
        var permissionText = "";
        if (permission != null && permission != "")
            permissionText = "," + permission;
        console.log(permissionText);
        conn.query("SELECT adminId,adminName,adminToken" + permissionText + " FROM administratorAccounts WHERE adminId='" + adminId + "';", function (err, resultAuthentication, fields) {
            if (err) throw err;
            console.log(' ' + resultAuthentication.length);
            if (resultAuthentication.length > 0) {
                if (adminName == resultAuthentication[0].adminName && adminToken == resultAuthentication[0].adminToken && adminToken != null && adminToken != "") {
                    tokenlive = true;
                    if (permission != null && permission != "") {
                        console.log(resultAuthentication[0][permission]);
                        tokenlive = false;
                        if (resultAuthentication[0][permission] == true || resultAuthentication[0][permission] == "true")
                            tokenlive = true;
                    }
                }
            }
            console.log(tokenlive);
            resolve(tokenlive);
        });
    })
}


app.get('/checktoken', function (req, res) {
    var user_id = req.param('id');
    var user_name = req.param('username');
    var token = req.param('token');
    console.log('Check token ' + user_name);
    conn.query("SELECT id,username,token FROM accounts WHERE id = '" + user_id + "';", function (err, result, fields) {
        if (err) throw err;
        console.log(' ' + result.length);
        if (result.length > 0) {
            var obj = {
                status: "",
                message: "",
            }
            if (user_name == result[0].username && token == result[0].token && token != null && token != "") {
                obj.status = "OK";
                obj.message = "token alive";
            } else {
                obj.status = "ERROR";
                obj.message = "token died";
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));

        } else {

            var obj = {
                status: "ERROR",
                message: "id does not exits",
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));

        }
    });
});

app.get('/register', function (req, res) {
    var user_fullname = req.param('fullname');
    var user_name = req.param('username');
    var user_password = req.param('password');
    var dateTimeCreated = req.param('dateTimeCreated');
    console.log('Registe Username:' + user_name + ' Full name: ' + user_fullname);
    conn.query("SELECT username FROM accounts WHERE username = '" + user_name + "';", function (err, result, fields) {
        if (err) throw err;
        console.log(' ' + result.length);
        if (result.length > 0) {
            var obj = {
                status: "ERROR",
                message: "Tên tài khoản đã tồn tại"
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));
        } else if (result.length == 0) {
            if (user_password.length > 7 && user_password.length < 20) {
                conn.query("INSERT INTO accounts (username,password,fullname,dateTimeCreated,currentBalance) VALUES ('" + user_name + "','" + crypto.createHash('sha256').update(user_password).digest('base64') + "','" + user_fullname + "','" + dateTimeCreated + "','0');", function (err, result, fields) {
                    if (err) throw err;
                    // var id_logs = result.insertId.toString();
                    // var obj1 = {
                    //     id: id_logs
                    // }
                    var obj = {
                        status: "OK",
                        message: "Đăng kí thành công"
                    }
                    console.log(JSON.stringify(obj));
                    res.send(JSON.stringify(obj));
                });
            } else {
                var obj = {
                    status: "ERROR",
                    message: "Mật khẩu không đạt yêu cầu"
                }
                console.log(JSON.stringify(obj));
                res.send(JSON.stringify(obj));
            }

        }
    });
});

app.get('/getTripInfomation', function (req, res) {
    var tripId = req.param('tripId');
    var tripCode = req.param('tripCode');
    console.log('Registe ' + tripId);
    conn.query("SELECT tripTo,tripFrom,departureTime,methodOfReceivingMoney,rangeOfVehicle,priceToBuyNow,priceStart,pricePlaceBid,priceBidCurrent,idLastUserBid,endBid,timeLastBid FROM marketTrips WHERE tripId=" + tripId + " AND tripCode='" + tripCode + "';", function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            var obj = {
                status: "OK",
                message: "Lấy dữ liệu thành công",
                tripTo: result[0].tripTo,
                tripFrom: result[0].tripFrom,
                departureTime: result[0].departureTime,
                methodOfReceivingMoney: result[0].methodOfReceivingMoney,
                rangeOfVehicle: result[0].rangeOfVehicle,
                priceToBuyNow: result[0].priceToBuyNow,
                priceStart: result[0].priceStart,
                pricePlaceBid: result[0].pricePlaceBid,
                priceBidCurrent: result[0].priceBidCurrent,
                idLastUserBid: result[0].idLastUserBid,
                endBid: result[0].endBid,
                timeLastBid: result[0].timeLastBid
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));
        } else {
            var obj = {
                status: "ERROR",
                message: "Dữ liệu không tồn tại",
                tripTo: "",
                tripFrom: "",
                departureTime: "",
                methodOfReceivingMoney: "",
                rangeOfVehicle: "",
                priceToBuyNow: "",
                priceStart: "",
                priceBidCurrent: "",
                idUserBid: "",
                endBid: ""
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));

        }
    });

});

app.get('/uploadtrip', async function (req, res) {
    var customerIsFullName = req.param('customerIsFullName');
    var customerIsPhone = req.param('customerIsPhone');
    var rangeOfVehicle = req.param('rangeOfVehicle');
    var guestPrice = req.param('guestPrice');
    var priceStart = req.param('priceStart');
    var priceToSellNow = req.param('priceToSellNow');
    var timeOpenOnMarket = req.param('timeOpenOnMarket');
    var tripFrom = req.param('tripFrom');
    var tripTo = req.param('tripTo');
    var departureTime = req.param('departureTime');
    var methodOfReceivingMoney = req.param('methodOfReceivingMoney');
    var approved = false.toString();
    var dateTimePosted = req.param('dateTimePosted');
    var accountId = req.param('accountId');
    var accountUsername = req.param('accountUsername');
    var token = req.param('token');
    console.log('Upload trip ' + customerIsPhone);
    function GenerateTrip() {
        var tripCode = generate_tripCode(6);
        console.log(' ' + tripCode);
        conn.query("SELECT tripId FROM tripsPending WHERE tripCode = '" + tripCode + "';", function (err, result, fields) {
            if (err) throw err;
            console.log('Result length ' + result.length);
            if (result.length == 0) {
                // console.log("INSERT INTO tripsPending (tripCode,customerIsFullName,customerIsPhone,rangeOfVehicle,guestPrice,priceToSellNow,priceStart,timeOpenOnMarket,tripFrom,tripTo,departureTime,methodOfReceivingMoney,approved) VALUES ('" + tripCode + "','" + customerIsFullName + "','" + customerIsPhone + "','" + rangeOfVehicle + "','" + guestPrice + "','" + priceStart + "','" + priceToSellNow + "','" + timeOpenOnMarket + "','" + tripFrom + "','" + tripTo + "','" + departureTime + "','" + methodOfReceivingMoney + "','" + approved + "');")
                conn.query("INSERT INTO tripsPending (tripCode,customerIsFullName,customerIsPhone,rangeOfVehicle,guestPrice,priceToSellNow,priceStart,timeOpenOnMarket,tripFrom,tripTo,departureTime,methodOfReceivingMoney,approved,dateTimePosted,idUserPosted) VALUES ('" + tripCode + "','" + customerIsFullName + "','" + customerIsPhone + "','" + rangeOfVehicle + "','" + guestPrice + "','" + priceStart + "','" + priceToSellNow + "','" + timeOpenOnMarket + "','" + tripFrom + "','" + tripTo + "','" + departureTime + "','" + methodOfReceivingMoney + "','" + approved + "','" + dateTimePosted + "','" + accountId + "');", function (err, result, fields) {
                    if (err) console.log(err.message);
                    if (err) throw err;
                    var obj = {
                        status: "OK",
                        message: "Đăng chuyến thành công"
                    }
                    console.log(JSON.stringify(obj));
                    res.send(JSON.stringify(obj));
                });
            } else GenerateTrip();
        });
    }
    // GenerateTrip();
    var checkau = await CheckAuthentication(accountId, accountUsername, token);
    console.log(checkau);
    if (checkau) {
        GenerateTrip();
    }
});

app.get('/approval', function (req, res) {
    var tripId = req.param('tripId');
    var tripCode = req.param('tripCode');
    var pricePlaceBid = req.param('pricePlaceBid');
    var tripType = req.param('tripType');
    console.log('Approval ' + tripId + ' ' + tripCode);
    conn.query("SELECT tripCode,customerIsFullName,customerIsPhone,rangeOfVehicle,guestPrice,priceToSellNow,priceStart,timeOpenOnMarket,tripFrom,tripTo,departureTime,methodOfReceivingMoney,dateTimePosted,idUserPosted FROM tripsPending WHERE tripId='" + tripId + "' AND tripCode = '" + tripCode + "' AND approved='false';", function (err, result, fields) {
        if (err) {
            var obj = {
                status: "ERROR",
                message: "Lỗi không xác định 0"
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));
        }
        if (err) throw err;
        console.log('Result length ' + result.length);
        if (result.length > 0) {
            console.log("INSERT INTO marketTrips (tripCode,customerIsFullName,customerIsPhone,rangeOfVehicle,guestPrice,priceToBuyNow,priceStart,timeOpenOnMarket,tripFrom,tripTo,departureTime,methodOfReceivingMoney,pricePlaceBid,endBid,tripType,dateTimePosted,idUserPosted) VALUES ('" + result[0].tripCode + "','" + result[0].customerIsFullName + "','" + result[0].customerIsPhone + "','" + result[0].rangeOfVehicle + "','" + result[0].guestPrice + "','" + result[0].priceStart + "','" + result[0].priceToSellNow + "','" + dateFormat(result[0].timeOpenOnMarket, "yyyy-mm-dd HH:MM:ss") + "','" + result[0].tripFrom + "','" + result[0].tripTo + "','" + dateFormat(result[0].departureTime, "yyyy-mm-dd HH:MM:ss") + "','" + result[0].methodOfReceivingMoney + "','" + pricePlaceBid + "','false','" + tripType + "','" + dateFormat(result[0].dateTimePosted, "yyyy-mm-dd HH:MM:ss") + "','" + result[0].idUserPosted + "');");
            conn.query("INSERT INTO marketTrips (tripCode,customerIsFullName,customerIsPhone,rangeOfVehicle,guestPrice,priceToBuyNow,priceStart,timeOpenOnMarket,tripFrom,tripTo,departureTime,methodOfReceivingMoney,pricePlaceBid,endBid,tripType,dateTimePosted,idUserPosted) VALUES ('" + result[0].tripCode + "','" + result[0].customerIsFullName + "','" + result[0].customerIsPhone + "','" + result[0].rangeOfVehicle + "','" + result[0].guestPrice + "','" + result[0].priceStart + "','" + result[0].priceToSellNow + "','" + dateFormat(result[0].timeOpenOnMarket, "yyyy-mm-dd HH:MM:ss") + "','" + result[0].tripFrom + "','" + result[0].tripTo + "','" + dateFormat(result[0].departureTime, "yyyy-mm-dd HH:MM:ss") + "','" + result[0].methodOfReceivingMoney + "','" + pricePlaceBid + "','false','" + tripType + "','" + dateFormat(result[0].dateTimePosted, "yyyy-mm-dd HH:MM:ss") + "','" + result[0].idUserPosted + "');", function (err, result, fields) {
                if (err) {
                    var obj = {
                        status: "ERROR",
                        message: "Lỗi không xác định 1"
                    }
                    console.log(JSON.stringify(obj) + err.message);
                    res.send(JSON.stringify(obj));
                }
                if (err) throw err;
                conn.query("UPDATE tripsPending SET approved='true' WHERE tripId='" + tripId + "' AND tripCode = '" + tripCode + "' AND approved='false';", function (err, result, fields) {
                    if (err) {
                        var obj = {
                            status: "ERROR",
                            message: "Lỗi không xác định 2"
                        }
                        console.log(JSON.stringify(obj));
                        res.send(JSON.stringify(obj));
                    }
                    if (err) throw err;
                    var obj = {
                        status: "OK",
                        message: "Xét duyệt thành công"
                    }
                    console.log(JSON.stringify(obj));
                    res.send(JSON.stringify(obj));
                });
            });
        } else {
            var obj = {
                status: "ERROR",
                message: "Chuyến chờ xét duyệt không tồn tại"
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));
        }
    });

});

app.get('/getTripsMarket', function (req, res) {
    var accountId = req.param('accountId');
    var accountUsername = req.param('accountUsername');
    var token = req.param('token');
    var rangeOfVehicle = req.param('rangeOfVehicle');
    var departureTime = req.param('departureTime');
    var dateTimeNow = req.param('dateTimeNow');
    var rangeOfVehicleText = "";
    if (rangeOfVehicle != "all")
        rangeOfVehicleText = "rangeOfVehicle='" + rangeOfVehicle + "' AND ";
    if (departureTime == "null")
        departureTime = "2030-01-01 06:00:00";
    console.log("SELECT tripId,tripCode,tripTo,tripFrom,departureTime,methodOfReceivingMoney,rangeOfVehicle,priceToBuyNow,priceStart,tripType FROM marketTrips WHERE endBid='false' AND departureTime>'" + dateTimeNow + "' AND " + rangeOfVehicleText + "departureTime<'" + dateFormat(departureTime, "yyyy-mm-dd HH:MM:ss") + "' AND timeOpenOnMarket<'" + dateTimeNow + "';");
    conn.query("SELECT tripId,tripCode,tripTo,tripFrom,departureTime,methodOfReceivingMoney,rangeOfVehicle,priceToBuyNow,priceStart,tripType FROM marketTrips WHERE endBid='false' AND departureTime>'" + dateTimeNow + "' AND " + rangeOfVehicleText + "departureTime<'" + dateFormat(departureTime, "yyyy-mm-dd HH:MM:ss") + "' AND timeOpenOnMarket<'" + dateTimeNow + "';", function (err, result, fields) {
        if (err) throw err;
        var objectList = [];
        i = 0;
        while (i < result.length) {
            objectList.push(
                {
                    tripId: result[i].tripId,
                    tripCode: result[i].tripCode,
                    tripTo: result[i].tripTo,
                    tripFrom: result[i].tripFrom,
                    departureTime: dateFormat(result[i].departureTime, "yyyy-mm-dd HH:MM:ss"),
                    methodOfReceivingMoney: result[i].methodOfReceivingMoney,
                    rangeOfVehicle: result[i].rangeOfVehicle,
                    priceToBuyNow: result[i].priceToBuyNow,
                    priceStart: result[i].priceStart,
                    tripType: result[i].tripType
                }
            )
            i++;
        };
        console.log(objectList);
        res.send(JSON.stringify(objectList));
    });
});

app.get('/bid', function (req, res) {
    var tripId = req.param('tripId');
    var tripCode = req.param('tripCode');

    var priceBidCurrent = req.param('priceBidCurrent');
    var timeLastBid = req.param('timeLastBid');

    var idLastUserBid = req.param('idLastUserBid');
    var user_name = req.param('username');
    var token = req.param('token');

    console.log('Check idUser - userName - token :' + idLastUserBid + ' - ' + user_name + ' - ' + token);
    conn.query("SELECT currentBalance FROM accounts WHERE id = '" + idLastUserBid + "' AND username='" + user_name + "' AND token='" + token + "';", function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            var currentBalance = result[0].currentBalance;
            console.log('priceBidCurrent pricePlaceBid');
            conn.query("SELECT priceBidCurrent,pricePlaceBid,priceToBuyNow,methodOfReceivingMoney,priceStart,idLastUserBid FROM marketTrips WHERE tripId='" + tripId + "' AND tripCode = '" + tripCode + "';", function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    var priceBid = parseInt(priceBidCurrent);
                    var pricePlaceBid = parseInt(result[0].pricePlaceBid);
                    var priceToBuyNow = parseInt(result[0].priceToBuyNow);
                    var methodOfReceivingMoney = result[0].methodOfReceivingMoney;
                    var priceStart = parseInt(result[0].priceStart);
                    var priceBidCurrent2;
                    if (result[0].priceBidCurrent == null || result[0].priceBidCurrent == "") {
                        priceBidCurrent2 = priceStart + pricePlaceBid;
                    } else {
                        priceBidCurrent2 = parseInt(result[0].priceBidCurrent);
                    }
                    var idLastUserBid2 = result[0].idLastUserBid;
                    console.log('Check price ' + priceBid + ' ' + priceBidCurrent2 + ' ' + pricePlaceBid + ' ' + priceToBuyNow + ' ' + methodOfReceivingMoney);
                    if (idLastUserBid2 != idLastUserBid && ((priceBid == (priceBidCurrent2 - pricePlaceBid) && priceBid >= priceToBuyNow) || (priceBid == priceToBuyNow && priceBid < priceBidCurrent2))) {
                        console.log('Check balance');
                        if (methodOfReceivingMoney == "0") {
                            if (currentBalance > priceBid) {
                                conn.query("UPDATE marketTrips SET priceBidCurrent='" + priceBid + "',idLastUserBid='" + idLastUserBid + "',timeLastBid='" + timeLastBid + "' WHERE tripId='" + tripId + "' AND tripCode = '" + tripCode + "';", function (err, result, fields) {
                                    if (err) throw err;
                                    var obj = {
                                        status: "OK",
                                        message: "Đặt giá thành công"
                                    }
                                    console.log(JSON.stringify(obj));
                                    res.send(JSON.stringify(obj));
                                });
                            } else {
                                var obj = {
                                    status: "ERROR",
                                    message: "Số dư không đủ"
                                }
                                console.log(JSON.stringify(obj));
                                res.send(JSON.stringify(obj));
                            }
                        } else if (methodOfReceivingMoney == "1") {
                            conn.query("UPDATE marketTrips SET priceBidCurrent='" + priceBid + "',idLastUserBid='" + idLastUserBid + "',timeLastBid='" + timeLastBid + "' WHERE tripId='" + tripId + "' AND tripCode = '" + tripCode + "';", function (err, result, fields) {
                                if (err) throw err;
                                var obj = {
                                    status: "OK",
                                    message: "Đặt giá thành công"
                                }
                                console.log(JSON.stringify(obj));
                                res.send(JSON.stringify(obj));
                            });
                        }
                    } else {
                        var obj = {
                            status: "ERROR",
                            message: "Đấu giá không hợp lệ"
                        }
                        console.log(JSON.stringify(obj));
                        res.send(JSON.stringify(obj));
                    }
                } else {
                    var obj = {
                        status: "ERROR",
                        message: "Chuyến đi không tồn tại"
                    }
                    console.log(JSON.stringify(obj));
                    res.send(JSON.stringify(obj));
                }
            });
        } else {
            var obj = {
                status: "ERROR",
                message: "Chứng thực không tồn tại"
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));
        }
    });

});

app.get('/HistoryOfPostedTrips', async function (req, res) {
    var accountId = req.param('accountId');
    var accountUsername = req.param('accountUsername');
    var token = req.param('token');

    var rangeOfVehicle = req.param('rangeOfVehicle');
    var rangeOfVehicleText = ""
    if (rangeOfVehicle != "all")
        rangeOfVehicleText = " AND rangeOfVehicle='" + rangeOfVehicle + "'";

    var dateTimePostedEnd = req.param('dateTimePostedEnd');
    var dateTimePostedEndText = "";
    if (dateTimePostedEnd == "null") {
        dateTimePostedEndText = "2030-01-01 06:00:00";
    }
    var objectList = [];
    if (await CheckAuthentication(accountId, accountUsername, token)) {
        console.log("SELECT tripId,tripCode,rangeOfVehicle,dateTimePosted FROM tripspending WHERE idUserPosted='" + accountId + "' AND dateTimePosted<'" + dateTimePostedEndText + "'" + rangeOfVehicleText + ";");
        conn.query("SELECT tripId,tripCode,rangeOfVehicle,dateTimePosted FROM tripspending WHERE idUserPosted='" + accountId + "' AND dateTimePosted<'" + dateTimePostedEndText + "'" + rangeOfVehicleText + ";", async function (err, result, fields) {
            if (err) throw err;
            console.log(result.length);
            var i = 0;
            while (i < result.length) {
                var obj = {
                    tripId: "null",
                    tripIdPendding: result[i].tripId.toString(),
                    tripCode: result[i].tripCode,
                    dateTimePosted: dateFormat(result[i].dateTimePosted, "yyyy-mm-dd HH:MM:ss"),
                    statusTripPosted: "0"
                }
                console.log(obj);
                var obj1 = await GetFromMarket(obj);
                objectList.push(obj1);
                i++;
            }
            console.log(objectList);
            res.send(JSON.stringify(objectList));
        });
    } else { }
});

async function GetFromMarket(obj2) {
    return new Promise(function (resolve, reject) {
        console.log(obj2);
        conn.query("SELECT tripId,endBid FROM markettrips WHERE tripCode='" + obj2.tripCode + "';", function (err, result1, fields) {
            if (err) throw err;
            if (result1.length > 0) {
                obj2.tripId = result1[0].tripId.toString();
                if (result1[0].endBid == "true") {
                    obj2.statusTripPosted = "2";
                } else { result1[0].endBid == "false" } {
                    obj2.statusTripPosted = "1";
                }
            }
            return resolve(obj2);
        });
    })
}

app.get('/transactionHistory', async function (req, res) {
    var accountId = req.param('accountId');
    var accountUsername = req.param('accountUsername');
    var token = req.param('token');
    if (await CheckAuthentication(accountId, accountUsername, token)) {
        conn.query("SELECT transactionId,transactionAmout,transactionNote,transactionDateTime FROM transactionHistory WHERE accountId='" + accountId + "';", async function (err, result, fields) {
            if (err) throw err;
            var objectList = [];
            var i = 0;
            while (i < result.length) {
                objectList.push(
                    {
                        transactionId: result[i].transactionId,
                        transactionAmout: result[i].transactionAmout,
                        transactionNote: result[i].transactionNote,
                        transactionDateTime: dateFormat(result[i].transactionDateTime, "yyyy-mm-dd HH:MM:ss"),
                    }
                )
                i++;
            }
            console.log(objectList);
            res.send(JSON.stringify(objectList));
        });
    }
});

app.get('/createAdminAccount', async function (req, res) {
    var adminName = req.param('adminName');
    var adminPassword = req.param('adminPassword');
    var dateTimeCreated = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
    var permissionActive = req.param('permissionActive');
    var permissionBanned = req.param('permissionBanned');
    var permissionAddMoney = req.param('permissionAddMoney');
    var permissionDeductMoney = req.param('permissionDeductMoney');
    var permissionApproveTrip = req.param('permissionApproveTrip');
    var permissionCancelTrip = req.param('permissionCancelTrip');
    var permissionSuspendTrip = req.param('permissionSuspendTrip');
    var permissionEditTrip = req.param('permissionEditTrip');
    var permissionApproveCar = req.param('permissionApproveCar');
    var permissionSuspendCar = req.param('permissionSuspendCar');
    console.log('Create Admin:' + adminName + ' adminPassword: ' + adminPassword);
    conn.query("SELECT adminName FROM administratorAccounts WHERE adminName = '" + adminName + "';", function (err, result, fields) {
        if (err) throw err;
        console.log(' ' + result.length);
        if (result.length > 0) {
            var obj = {
                status: "ERROR",
                message: "Tên tài khoản đã tồn tại"
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));
        } else if (result.length == 0) {
            if (adminPassword.length > 7 && adminPassword.length < 20) {
                conn.query("INSERT INTO administratorAccounts (adminName,adminPassword,dateTimeCreated,permissionActive,permissionBanned,permissionAddMoney,permissionDeductMoney,permissionApproveTrip,permissionCancelTrip,permissionSuspendTrip,permissionEditTrip,permissionApproveCar,permissionSuspendCar) VALUES ('" + adminName + "','" + crypto.createHash('sha256').update(adminPassword).digest('base64') + "','" + dateTimeCreated + "','" + permissionActive + "','" + permissionBanned + "','" + permissionAddMoney + "','" + permissionDeductMoney + "','" + permissionApproveTrip + "','" + permissionCancelTrip + "','" + permissionSuspendTrip + "','" + permissionEditTrip + "','" + permissionApproveCar + "','" + permissionSuspendCar + "');", function (err, result, fields) {
                    if (err) throw err;
                    // var id_logs = result.insertId.toString();
                    // var obj1 = {
                    //     id: id_logs
                    // }
                    var obj = {
                        status: "OK",
                        message: "Đăng kí thành công"
                    }
                    console.log(JSON.stringify(obj));
                    res.send(JSON.stringify(obj));
                });
            } else {
                var obj = {
                    status: "ERROR",
                    message: "Mật khẩu không đạt yêu cầu"
                }
                console.log(JSON.stringify(obj));
                res.send(JSON.stringify(obj));
            }

        }
    });
});

app.get('/adminLogin', async function (req, res) {
    var adminName = req.param('adminName');
    var adminPassword = req.param('adminPassword');
    console.log('Check login admin ' + adminName);
    conn.query("SELECT adminId FROM administratorAccounts WHERE adminName = '" + adminName + "' AND adminPassword='" + crypto.createHash('sha256').update(adminPassword).digest('base64') + "';", function (err, result, fields) {
        if (err) throw err;
        console.log(' ' + result.length);
        if (result.length > 0) {
            var adminId = result[0].adminId;
            var adminToken = generate_token(32);

            conn.query("UPDATE administratorAccounts SET adminToken='" + adminToken + "' WHERE adminName=" + adminName + " AND adminId=" + adminId + ";", function (err, result, fields) {
                if (err) throw err;

                var obj = {
                    status: "OK",
                    message: "Đăng nhập thành công",
                    adminId: adminId,
                    adminName: adminName,
                    adminToken: adminToken,
                }
                console.log(JSON.stringify(obj));
                res.send(JSON.stringify(obj));
            });
        } else {

            var obj = {
                status: "ERROR",
                message: "Sai tên đăng nhập hoặc mật khẩu",
                token: ""
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));

        }
    });

});

app.get('/checkAdminToken', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    console.log('Check token admin ' + adminName);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT permissionActive,permissionBanned,permissionAddMoney,permissionDeductMoney,permissionApproveTrip,permissionCancelTrip,permissionSuspendTrip,permissionEditTrip,permissionApproveCar,permissionSuspendCar FROM administratorAccounts WHERE adminId = '" + adminId + "' AND adminName='" + adminName + "';", function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                var obj = {
                    status: "OK",
                    message: "SUCCESS !",
                    permissionActive: result[0].permissionActive,
                    permissionBanned: result[0].permissionBanned,
                    permissionAddMoney: result[0].permissionAddMoney,
                    permissionDeductMoney: result[0].permissionDeductMoney,
                    permissionApproveTrip: result[0].permissionApproveTrip,
                    permissionCancelTrip: result[0].permissionCancelTrip,
                    permissionSuspendTrip: result[0].permissionSuspendTrip,
                    permissionEditTrip: result[0].permissionEditTrip,
                    permissionApproveCar: result[0].permissionApproveCar,
                    permissionSuspendCar: result[0].permissionSuspendCar
                }
                console.log(JSON.stringify(obj));
                res.send(JSON.stringify(obj));
            } else {
                var obj = {
                    status: "ERROR",
                    message: "Error Unknown"
                }
                console.log(JSON.stringify(obj));
                res.send(JSON.stringify(obj));
            }
        });
    } else {
        var obj = {
            status: "ERROR",
            message: "Token died"
        }
        console.log(JSON.stringify(obj));
        res.send(JSON.stringify(obj));
    }
});

app.get('/usersCountPage', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    //console.log(rowStart + "," + maxRowInPage);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT COUNT(*) AS pageCount FROM accounts;", async function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                var obj =
                {
                    status: "OK",
                    pageCount: (result[0].pageCount / maxRowInPage)
                }
                console.log(obj);
                res.send(JSON.stringify(obj));
            }
        });
    }
});

var maxRowInPage = 50;
app.get('/users', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    var page = req.param('page');
    var rowStart = ((page - 1) * maxRowInPage);
    console.log(rowStart + "," + maxRowInPage);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT id,username,email,phone,fullname,currentBalance,datetimeCreated,status FROM accounts LIMIT " + rowStart + "," + maxRowInPage + ";", async function (err, result, fields) {
            if (err) throw err;
            var objectList = [];
            var i = 0;
            while (i < result.length) {
                objectList.push(
                    {
                        id: result[i].id,
                        username: result[i].username,
                        email: result[i].email,
                        phone: result[i].phone,
                        fullname: result[i].fullname,
                        balance: result[i].currentBalance,
                        datetimeCreated: dateFormat(result[i].datetimeCreated, "yyyy-mm-dd HH:MM:ss"),
                        status: result[i].status,
                    }
                )
                i++;
            }
            console.log(objectList);
            res.send(JSON.stringify(objectList));
        });
    }
});

app.get('/test', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, "permissionActive")) {
        var obj = {
            status: "OK",
            message: "Token died"
        }
        console.log(JSON.stringify(obj));
        res.send(JSON.stringify(obj));
    } else {
        var obj = {
            status: "ERROR",
            message: "Token died"
        }
        console.log(JSON.stringify(obj));
        res.send(JSON.stringify(obj));

    }
});

app.get('/setUserPermission', async function (req, res) {
    var userPermission = req.param('userPermission');
    var idUser = req.param('idUser');
    var userName = req.param('userName');
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    console.log(idUser);
    var userPermissionText = null;
    if (userPermission == "1") {
        userPermissionText = "permissionActive";
    } else if (userPermission == "1") {
        userPermissionText = "permissionBanned";
    }
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, userPermissionText)) {
        conn.query("UPDATE accounts SET status='" + userPermission + "' WHERE username='" + userName + "' AND id=" + idUser + ";", async function (err, result, fields) {
            if (err) throw err;
            var obj = {
                status: "OK",
                message: "Đặt quyền thành công"
            }
            console.log(JSON.stringify(obj));
            res.send(JSON.stringify(obj));
        });
    } else {
        var obj = {
            status: "ERROR",
            message: "Chứng thực thất bại"
        }
        console.log(JSON.stringify(obj));
        res.send(JSON.stringify(obj));

    }
});

app.get('/addBalance', async function (req, res) {
    var amount = req.param('amount');
    var idUser = req.param('idUser');
    var userName = req.param('userName');
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    var amountInt = Number(amount);
    console.log(idUser);
    var permissionText = null;
    if (amountInt > 0) {
        permissionText = "permissionAddMoney";
    } else if (amountInt < 0) {
        permissionText = "permissionDeductMoney";
    }
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, permissionText)) {
        conn.query("SELECT currentBalance FROM accounts WHERE id = '" + idUser + "' AND userName = '" + userName + "';", function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                var currentBalance = Number(result[0].currentBalance);
                var amountAdd = currentBalance + amountInt;
                conn.query("UPDATE accounts SET currentBalance='" + amountAdd + "' WHERE username='" + userName + "' AND id=" + idUser + ";", async function (err, result, fields) {
                    if (err) throw err;
                    var obj = {
                        status: "OK",
                        message: "Add balance success"
                    }
                    console.log(JSON.stringify(obj));
                    res.send(JSON.stringify(obj));
                });

            }
        });
    } else {
        var obj = {
            status: "ERROR",
            message: "Chứng thực thất bại"
        }
        console.log(JSON.stringify(obj));
        res.send(JSON.stringify(obj));

    }
});

app.get('/adminLoadMarket', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    var page = req.param('page');
    var rowStart = ((page - 1) * maxRowInPage);
    console.log(rowStart + "," + maxRowInPage);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT * FROM tripspending LIMIT " + rowStart + "," + maxRowInPage + ";", async function (err, result, fields) {
            if (err) throw err;
            var tripspending = result;
            var objListExport = [];
            for (var a = 0; a < tripspending.length; a++) {
                var obj = tripspending[a];
                obj.tripStatus = 0;
                if (tripspending[a].approved == true || tripspending[a].approved == "true") {
                    var markettrip = await GetFromMarket1(tripspending[a]);
                    markettrip.tripId = obj.tripId;
                    obj = markettrip;
                    obj.tripStatus = 1;
                    console.log(JSON.stringify(obj));
                }
                obj.departureTime = dateFormat(obj.departureTime, "yyyy-mm-dd HH:MM:ss");
                objListExport.push(obj);
            }
            console.log(JSON.stringify(objListExport));
            res.send(JSON.stringify(objListExport));

        });


    }
});

async function GetFromMarket1(obj2) {
    return new Promise(function (resolve, reject) {
        console.log(obj2);
        var markettrip = null;
        conn.query("SELECT * FROM markettrips WHERE tripCode='" + obj2.tripCode + "';", function (err, result1, fields) {
            if (err) throw err;
            if (result1.length > 0) {
                markettrip = result1[0];
            }
            console.log(JSON.stringify(markettrip))
            return resolve(markettrip);
        });
    })
}

app.get('/marketCountPage', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    //console.log(rowStart + "," + maxRowInPage);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT COUNT(*) AS pageCount FROM tripspending;", async function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                var obj =
                {
                    status: "OK",
                    pageCount: (result[0].pageCount / maxRowInPage)
                }
                console.log(obj);
                res.send(JSON.stringify(obj));
            }
        });
    }
});

app.get('/adminLoadTripInfomation', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    var tripCode = req.param('tripCode');
    console.log(tripCode);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT * FROM tripspending WHERE tripCode='" + tripCode + "';", async function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                var obj = result[0];
                conn.query("SELECT * FROM markettrips WHERE tripCode='" + tripCode + "';", async function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) {
                        var obj1 = result[0];
                        obj1.tripId = obj.tripId;
                        // obj1.departureTime=dateFormat(obj1.departureTime, "yyyy-mm-dd")+"T"+dateFormat(obj1.departureTime, "HH:MM");
                        // obj1.timeOpenOnMarket=dateFormat(obj1.timeOpenOnMarket, "yyyy-mm-dd")+"T"+dateFormat(obj1.timeOpenOnMarket, "HH:MM");
                        // obj1.dateTimePosted=dateFormat(obj1.dateTimePosted, "yyyy-mm-dd")+"T"+dateFormat(obj1.dateTimePosted, "HH:MM");

                        console.log(JSON.stringify(obj1));
                        res.send(JSON.stringify(obj1));
                    } else {
                        // obj.departureTime=dateFormat(obj.departureTime, "yyyy-mm-dd")+"T"+dateFormat(obj.departureTime, "HH:MM");
                        // obj.timeOpenOnMarket=dateFormat(obj.timeOpenOnMarket, "yyyy-mm-dd")+"T"+dateFormat(obj.timeOpenOnMarket, "HH:MM");
                        // obj.dateTimePosted=dateFormat(obj.dateTimePosted, "yyyy-mm-dd")+"T"+dateFormat(obj.dateTimePosted, "HH:MM");
                        console.log(JSON.stringify(obj));
                        res.send(JSON.stringify(obj));
                    }
                });
            }
        });
    }
});

app.get('/adminLoadCars', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    var page = req.param('page');
    var rowStart = ((page - 1) * maxRowInPage);
    console.log(rowStart + "," + maxRowInPage);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT * FROM cars LIMIT " + rowStart + "," + maxRowInPage + ";", async function (err, result, fields) {
            if (err) throw err;
            var objList = [];
            for (var a = 0; a < result.length; a++) {
                var obj = result[a];
                obj.dateTimePosted = dateFormat(result.dateTimePosted, "yyyy-mm-dd HH:MM:ss");
                objList.push(obj);
            }
            console.log(JSON.stringify(objList));
            res.send(JSON.stringify(objList));
        });
    }
});

app.get('/carsCountPage', async function (req, res) {
    var adminId = req.param('adminId');
    var adminName = req.param('adminName');
    var adminToken = req.param('adminToken');
    //console.log(rowStart + "," + maxRowInPage);
    if (await CheckAuthenticationAdmin(adminId, adminName, adminToken, null)) {
        conn.query("SELECT COUNT(*) AS pageCount FROM cars;", async function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                var obj =
                {
                    status: "OK",
                    pageCount: (result[0].pageCount / maxRowInPage)
                }
                console.log(obj);
                res.send(JSON.stringify(obj));
            }
        });
    }
});


const imageUploader = multer({ dest: 'images/' });

app.post('/upload', imageUploader.single('myFile'), (req, res) => {
    const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);
    res.send({
        status: true,
        message: 'file uploaded',
        fileNameInServer: newFullPath
    })
})

var htmlPath = path.join(__dirname, 'firstreact/build');

app.use(express.static(htmlPath));

//var userRouters = require('./userRouters');
// Lưu ý: userRouters và index.js phải ở cùng 1 thư mục
//app.use('/user', userRouters);

app.listen(80);