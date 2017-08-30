var rentOrderList = null;
$(document).ready(function () {
    getWaitPayRentOrderList();
});
function getWaitPayRentOrderList() {
    var postData = {
        page_size: 8,
        page_index: $(".container-WaitPayRentOrderList").attr("page"),
        status: 3
    }
    $.ajax({
        type: 'POST',
        cache: false,
        url: config.server_url.get_rent_order_list,
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        success: function (data) {
            $(".container-WaitPayRentOrderList").attr("page", 1);
            if (data.rent_order_list != null && data.rent_order_list.length > 0) {
                rentOrderList = data.rent_order_list;
                var html = '';
                $.each(data.rent_order_list,
                    function (i, n) {
                        //html +=
                        //    '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="/www/content/images/icon-robot.png"></div><div class="weui-media-box__bd"><h4 class="weui-media-box__title">' + n.robot_code + '</h4><p class="weui-media-box__desc">订单号：' + n.rent_order_id + '</p></div><div class="weui-media-box__ft"><span href="javascript:;" class="weui-btn weui-btn_mini weui-btn_default">' + n.time_length + '天<hr/>￥' + accounting.formatNumber(n.amount / 100, 2) + '</span></div></a>';
                        var checked = "";//默认第一单选中
                        if (i == 0) checked = "checked";
                        html += '<div class="weui-cells weui-cells_checkbox"> <label class="weui-cell weui-check__label weui-media-box weui-media-box_appmsg" for="order' + n.rent_order_id + '"> <div class="weui-media-box__hd"> <img class="weui-media-box__thumb" src="/images/robot.png"> </div> <div class="weui-media-box__bd">';
                        html += '<div style="float: left">';
                        html += '<h4 class="weui-media-box__title">' + n.robot_code + '</h4>';
                        html += '<div class="weui-media-box__desc">租用时间：' + n.time_length + '天 &nbsp;押金：'+accounting.formatNumber(data.robot_deposit / 100,2)+'元</div>';
                        html += '<div class="weui-media-box__desc"></div>';
                        html += '</div>';
                        html += '<div class="weui-cell__ft">';
                        html += '<input type="radio" class="weui-check" name="rent_order_id" id="order' + n.rent_order_id + '" value="' + n.rent_order_id + '" checked="' + checked + '">';
                        html += '<i class="weui-icon-checked" style="margin-top: 0.5rem"></i>';
                        html += '</div>';
                        html += '<p class="weui-media-box__desc zt">￥' + accounting.formatNumber(n.amount / 100, 2) + '</p>';
                        html += '</div> </label> </div>';
                        // html += '<div class="weui-cells weui-cells_radio"><label class="weui-cell weui-check__label" for="order' + n.rent_order_id + '"><div class="weui-cell__bd"><p><div class="weui-flex"><div><div class="placeholder">【' + n.time_length + '天】</div></div><div class="weui-flex__item"><div class="placeholder">' + n.robot_code + '</div></div><div><div class="placeholder">￥' + accounting.formatNumber(n.amount / 100, 2) + '</div></div></div></p></div><div class="weui-cell__ft"><input type="radio" class="weui-check" name="rent_order_id" id="order' + n.rent_order_id + '" value="' + n.rent_order_id + '" checked="' + checked + '"><span class="weui-icon-checked"></span></div></label></div>';
                    });
                $(".list-WaitPayRentOrderList").append(html);
                $('.dropload-down').addClass('hide');
                $('.weui-msg__opr-area').removeClass('hide');
            } else {
                setTimeout(function () {
                    getWaitPayRentOrderList();
                },
                    500);
            }
        },
        error: function (xhr, type) {

        }
    });
}
function submitPay() {
    if (rentOrderList == null) {
        showAlert("商家未确认，请等待商家确认后支付。");
    } else {
        var formParam = serializeArrayToJson($("#form").serializeArray());
        if (formParam.rent_order_id == undefined) {
            showAlert("请选择要支付的租金记录");
        } else {
            goTo(config.page_url.pay_rent + "?id=" + formParam.rent_order_id);
        }
    }
}