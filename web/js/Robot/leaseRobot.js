$(document).ready(function () {
    //获取配置信息
    $.ajax({
        type: 'POST',
        url: config.server_url.get_jssdk_signature,
        dataType: 'json',
        success: function (data) {
            wx.config(data);
            showLeaseConfirm();
        },
        error: function (xhr, type) {
            showAlert("getJSSDKSignature出错");
        },
    });

    showLeaseConfirm();
});
function checkUserDeposit(robotCodeType, postCode) {
    var dialogLoading = null;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: config.server_url.check_user_deposit,
        beforeSend: function (XHR) {
            dialogLoading = showLoading();
        },
        success: function (data) {
            if (data.result_code == 0) {
                if (data.lease_robot_count > 0) {
                    leaseRobot(robotCodeType, postCode);
                    //showConfirm("是否确认租借？",function () {
                    //    createLeaseOrder(robotCodeType, postCode);
                    //});
                } else {
                    setTimeout(function () {
                        showAlert("您没有足够的押金，请交付押金。", function () {
                            goTo(config.page_url.pay_deposit + "?robotCodeType=" + robotCodeType + "&robotCode=" + postCode);
                        });
                    }, 500);
                }
            }
        },
        error: function (xhr, type) {
            showAlert('error');
        },
        complete: function (xhr, type) {
            dialogLoading.hide();
        }
    });
}
function showLeaseConfirm() {
    weui.confirm('是否确认租借', {
        title: '<input class="check_IsLease" type="checkbox">优惠活动期间，我司希望您单次租赁时间不超过90天，为确保机器人的使用质量，超过90天后需将机器人回收升级。', className: 'dialog-IsLease', buttons: [{
            label: '取消',
            type: 'default',
            onClick: function() {
                wx.closeWindow();
            }
        }, {
            label: '确定',
            type: 'primary',
            onClick: function () {
                if ($('.check_IsLease').attr('checked')) {
                    scanQRCode();
                } else {
                    return false;
                }
            }
        }]
    });
}
function leaseRobot(robotCodeType, robotCodeValue) {
    var dialogLoading = null;
    var postData = {
        robot_code_list: [
            {
                robot_code_type: robotCodeType,
                robot_code_value: robotCodeValue
            }
        ]
    }
    $.ajax({
        type: 'POST',
        cache:false,
        url: config.server_url.lease_robot,
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        beforeSend: function (XHR) {
            dialogLoading = showLoading();
        },
        success: function (data) {
            if (data.result_code == 0) {
                goTo(config.page_url.leaseRobotWaitConfirm + "?robotCode=" + robotCodeValue + "&robotCodeType=" + robotCodeType);
            } else {
                setTimeout(function () {
                    showAlert(data.result_message);
                }, 500);

            }
        },
        error: function (xhr, type) {

        },
        complete: function (xhr, type) {
            dialogLoading.hide();
        }
    });
}
function scanQRCode() {

    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            //var result = "linuxserl.honeybot.cn:5120/download/?id=bind@104@10V1BLH100040478054";
            //var result = "CODE_128,10V1BLH100261";
            var postCode = "";
            var robotCodeType = 0;
            if (result.indexOf(",") > -1) {
                //条形码
                var codes = result.split(',');
                if (codes != null && codes.length > 1) {
                    postCode = codes[1];
                    robotCodeType = 1;
                }
            } else {
                //二维码
                var reg = /@(.*?)@/;
                var codes = reg.exec(result);
                if (codes != null) {
                    postCode = codes[1];
                    robotCodeType = 0;
                }else{
                    showAlert("不是正确的机器人二维码");
                }

            }
            checkUserDeposit(robotCodeType, postCode);


        }
    });
}

wx.error(function (res) {
    showAlert("微信接口出错");
});