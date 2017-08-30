$(document).ready(function () {
    getLeaseOrderList();
});
function getLeaseOrderList() {
    $('.container-LeaseOrderList').dropload({
        scrollArea:window,
        loadDownFn: function (me) {
            var postData = {
                page_size: 8,
                page_index: parseInt($(".container-LeaseOrderList").attr("page")),
                status:9
            }
            $.ajax({
                type: 'POST',
                cache: false,
                url: config.server_url.get_lease_order_list,
                data: "json_body=" + JSON.stringify(postData),
                dataType: 'json',
                success: function (data) {
                    // 每次数据加载完，必须重置
                    $(".container-LeaseOrderList").attr("page", parseInt(postData.page_index) + 1);
                    if (data.lease_order_list != null && data.lease_order_list.length > 0) {
                        var html = '';
                        $.each(data.lease_order_list,
                            function (i, n) {
                                var status = "";
                                var btnRefundHtml = "";
                                var textAlign = "";
                                switch (n.status) {
                                    case 1:
                                        status = "已支付";
                                        textAlign = '</span></span> </div> <div class="weui-form-preview__ft"> <a class="weui-form-preview__btn weui-form-preview__btn_default" href="javascript:" >';
                                        btnRefundHtml ='<button type="submit" class="weui-form-preview__btn weui-form-preview__btn_danger" style="color:red;" href="javascript:" onclick="returnLease(' + n.deposit_order_id + ')">退款</button> </div>'
                                        ;
                                        break;
                                    case 2:
                                        status = "未支付";
                                        textAlign = '</span></span> </div> <div class="weui-form-preview__ft"> <a class="weui-form-preview__btn weui-form-preview__btn_default" href="javascript:" style="text-align: right;padding-right: 5%">';
                                        btnRefundHtml ='</div>'
                                        break;
                                    case 3:
                                        status = "已退款";
                                        textAlign = '</span></span> </div> <div class="weui-form-preview__ft"> <a class="weui-form-preview__btn weui-form-preview__btn_default" href="javascript:" style="text-align: right;padding-right: 5%">';
                                        btnRefundHtml ='</div>'
                                        ;
                                        break;
                                    case 4:
                                        status = "已冻结";
                                        textAlign = '</span></span> </div> <div class="weui-form-preview__ft"> <a class="weui-form-preview__btn weui-form-preview__btn_default" href="javascript:" style="text-align: right;padding-right: 5%">';
                                        btnRefundHtml ='</div>'
                                        break;
                                }
                                html += '<div class="weui-media-box weui-media-box_text"> <h4 class="weui-media-box__title">押金单号：';
                                html +=  n.deposit_order_id ;
                                html +=  '</h4> <p class="weui-media-box__desc">支付单号：';
                                html +=  n.payment_order_id;
                                html +=  '</p> <span class="label-Amount">押金：<span style="color: red;">';
                                html +=  accounting.formatNumber(n.amount / 100, 2);
                                html +=  textAlign + status + '</a>'+btnRefundHtml;
                            });
                        $(".list-LeaseOrderList").append(html);
                    }
                    if (data.page_count <= parseInt(postData.page_index) || data.page_count == 0) {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    me.resetload();
                },
                error: function (xhr, type) {
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        }
    });
}
function returnLease(leaseOrderId) {
    showConfirm("是否确认退还押金？",
        function() {
            var dialogLoading = null;
            var postData = {
                deposit_order_id: leaseOrderId
            }
            $.ajax({
                type: 'POST',
                cache: false,
                url: config.server_url.return_deposit,
                data: "json_body=" + JSON.stringify(postData),
                dataType: 'json',
                beforeSend: function (XHR) {
                    dialogLoading = showLoading();
                },
                success: function (data) {
                    if (data.result_code == 0) {
                        setTimeout(function () {
                            showAlert(data.result_message, function () {
                                var date_obj = new Date();
                                // window.location.href = window.location.href + '?timestamp=' + date_obj.getTime();
                                window.location.href = "https://sojump.com/jq/15339999.aspx";
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
        });

}