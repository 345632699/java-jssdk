$(document).ready(function () {
    //获取配置信息
    $.ajax({
        url : "http://120.77.43.103/wechat/getConfig",
        type : 'post',
        dataType : 'json',
        contentType : "application/x-www-form-urlencoded; charset=utf-8",
        data : {
            'url' : location.href.split('#')[0]
        },
        success : function(data) {
            console.log(data);
            wx.config({
                debug : true,
                appId : data.appId,
                timestamp : data.timestamp,
                nonceStr : data.nonceStr,
                signature : data.signature,
                jsApiList : [ 'checkJsApi', 'onMenuShareTimeline',
                    'onMenuShareAppMessage', 'onMenuShareQQ',
                    'onMenuShareWeibo', 'hideMenuItems',
                    'showMenuItems', 'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem', 'translateVoice',
                    'startRecord', 'stopRecord', 'onRecordEnd',
                    'playVoice', 'pauseVoice', 'stopVoice',
                    'uploadVoice', 'downloadVoice', 'chooseImage',
                    'previewImage', 'uploadImage', 'downloadImage',
                    'getNetworkType', 'openLocation', 'getLocation',
                    'hideOptionMenu', 'showOptionMenu', 'closeWindow',
                    'scanQRCode', 'chooseWXPay',
                    'openProductSpecificView', 'addCard', 'chooseCard',
                    'openCard' ]
            });
        },
        error: function (xhr, type) {
            showAlert("getJSSDKSignature出错");
        },
    });
    checkUserDeposit();
});
function checkUserDeposit() {
    wx.ready(function () {
        scanQRCode();
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
                if (codes.length > 1) {
                    postCode = codes[1];
                    robotCodeType = 0;
                }
            }
            showConfirm("是否确认退还？",
                function () {
                    returnRobot(robotCodeType, postCode);
                });
        }
    });
}
function returnRobot(robotCodeType, robotCodeValue) {
    var dialogLoading = null;
    var postData = {
        robot_code:
        {
            robot_code_type: robotCodeType,
            robot_code_value: robotCodeValue
        }
    }
    $.ajax({
        type: 'POST',
        cache: false,
        url: "http://120.77.43.103/wechat/doReturn",
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        beforeSend: function (XHR) {
            dialogLoading = showLoading();
        },
        success: function (data) {
            if (data.result_code == 0) {
                setTimeout(function() {
                    showAlert("申请退还机器人成功，请点击确定支付租金", function () {
                        goTo(config.page_url.return_robot_wait_confrm);
                    });
                }, 500);

            } else {
                setTimeout(function () {
                    showAlert(data.result_message);
                }, 500);

            }
        },
        error: function (xhr, type) {
            showAlert('error')
        },
        complete: function (xhr, type) {
            dialogLoading.hide();
        }
    });
}
wx.error(function (res) {
    showAlert("微信接口出错");
});