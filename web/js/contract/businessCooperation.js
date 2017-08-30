var postMediaId = null;
$(document).ready(function () {
    var dialogLoading = showLoading();
    $.ajax({
        type: 'POST',
        url: config.server_url.get_business_jssdk,
        dataType: 'json',
        success: function (data) {
            wx.config(data);
            wx.ready(function () {
                dialogLoading.hide();
            });
        },
        error: function (xhr, type) {
            showAlert("getJSSDKSignature出错");
        },
    });
});
function submitBusinessCooperation(ele) {
    if (!$(ele).hasClass("weui-btn_disabled")) {
        weui.form.validate('#form', function (error) {
            if (!error) {
                showConfirm("请检查您所填写的内容是否正确。是否继续提交申请？", function () {
                    if ($("#img-Phtoto").attr("uploadid") != "" && $("#img-Phtoto").attr("uploadid") != null) {
                        uploadImage(function () {
                            businessCooperation();
                        });
                    } else {
                        businessCooperation();
                    }
                });
            }
        });
    }
}
function businessCooperation() {
    var formParam = serializeArrayToJson($("#form").serializeArray());
    var dialogLoading = null;
    var postData = {
        shop_name: formParam.shop_name,
        address: formParam.address,
        contact_name: formParam.contact_name,
        contact_number: formParam.contact_number,
        media_id: postMediaId
    }
    $.ajax({
        type: 'GET',
        url: config.server_url.business_cooperation,
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        beforeSend: function (XHR) {
            dialogLoading = showLoading();
        },
        success: function (data) {
            if (data.result_code == 0) {
                setTimeout(function () {
                    showAlert("提交成功", function () {
                        wx.closeWindow();
                    });
                }, 500);
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
function chooseImage(ele) {
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            $("#img-Phtoto").attr("src", localIds[0]);
            $("#img-Phtoto").attr("uploadid", localIds[0]);
            $(".label-UploadPhoto").hide();
        }
    });
}
function uploadImage(success) {
    wx.uploadImage({
        localId: $("#img-Phtoto").attr("uploadid"), // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
            postMediaId = res.serverId; // 返回图片的服务器端ID
            success();
        }
    });
}