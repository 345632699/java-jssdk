var wechatData = null;
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: config.server_url.get_pay_jsk_config,
        dataType: 'json',
        success: function (data) {
            wx.config(data);
            payRent();
        },
        error: function (xhr, type) {
            showAlert("getJSSDKSignature出错");
        }
    });
});
wx.ready(function () {
    payRent();
});
function payRent() {
    var dialogLoading = null;
    var postData = {
        rent_order_id: getQueryString("id")
    }
    $.ajax({
        type: 'GET',
        url: config.server_url.create_rent_wechat_pay,
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        beforeSend: function (XHR) {
            dialogLoading = showLoading();
        },
        success: function (data) {
            if (data.result_code == 0) {
                wechatData = data.config;
                $("#btn-Pay").removeClass("weui-btn_disabled");
                $("#label-PayAmount").text(accounting.formatNumber(data.amount / 100, 2));
                $("#label-PayName").text(data.result_message);
                $("#btn-Pay").click(function () {
                    wx.chooseWXPay({
                        timestamp: wechatData.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: wechatData.nonceStr, // 支付签名随机串，不长于 32 位
                        package: wechatData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: wechatData.paySign, // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            showAlert("支付成功",
                                function () {
                                    goTo(config.page_url.rent_order_list);
                                });
                        }
                    });
                });
            } else {
                showAlert(data.result_message);
            }
        },
        error: function (xhr, type) {

        },
        complete: function (xhr, type) {
            dialogLoading.hide();
        }
    });
}
wx.error(function (res) {
    showAlert("微信接口出错");
});