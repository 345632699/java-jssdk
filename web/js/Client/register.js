
function registeredUser(ele) {
    if (!$(ele).hasClass("weui-btn_disabled")) {
        weui.form.validate('#form', function (error) {
            if (!error) {
                var formParam = serializeArrayToJson($("#form").serializeArray());
                if (formParam.phone_code.length != 4) {
                    showTopTips("请输入正确的验证码");
                    return;
                }
                var dialogLoading = null;
                var postData = {
                    phone_code: formParam.phone_code,
                    phone_number: formParam.phone_number
                }
                $.ajax({
                    type: 'GET',
                    url: config.server_url.registered_user,
                    data: "json_body=" + JSON.stringify(postData),
                    dataType: 'json',
                    beforeSend: function(XHR) {
                        dialogLoading = showLoading();
                    },
                    success: function(data) {
                        if (data.result_code == 0) {
                            var toGo = config.page_url.mine_mine;
                            if (getQueryString("url") != null) {
                                toGo = getQueryString("url");
                            }
                            goTo(toGo);
                        } else {
                            showAlert(data.result_message);
                        }
                    },
                    error: function(xhr, type) {

                    },
                    complete: function(xhr, type) {
                        dialogLoading.hide();
                    }
                });
            } else {
                var formParam = serializeArrayToJson($("#form").serializeArray());
                if (formParam.agree == undefined) {
                    showAlert("必须阅读并同意《相关条款》才能注册");
                }

            }
        });
    }
}

function sendSMS(ele) {
    if ($(ele).text() == "已发送") {
        showTopTips("已发送短信验证码");
        return;
    }
    weui.form.validate('#form', function (error) {
        if (!error) {
            var formParam = serializeArrayToJson($("#form").serializeArray());
            if (formParam.phone_number.length != 11) {
                showTopTips("请输入手机号码");
                return;
            }
            var dialogLoading = null;
            var postData = {
                phone_number: formParam.phone_number
            }
            $.ajax({
                type: 'GET',
                url: config.server_url.send_sms,
                data: "json_body=" + JSON.stringify(postData),
                dataType: 'json',
                beforeSend: function (XHR) {
                    dialogLoading = showLoading();
                },
                success: function (data) {
                    if (data.result_code == 0) {
                        var resendSeconds = 60;
                        $("#label-CountDown").show();
                        $(ele).text("已发送");
                        $("#btn-Submit").removeClass("weui-btn_disabled");
                        var seconds = 0;
                        var intervalCountDown = setInterval(function() {
                                seconds += 1;
                                $("#label-CountDown").text("(" + (resendSeconds - seconds) + ")");
                                if (seconds == resendSeconds) {
                                    $(ele).text("重新发送");
                                    clearInterval(intervalCountDown);
                                    $("#label-CountDown").hide();
                                }
                            },
                            1000);
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
    });
}