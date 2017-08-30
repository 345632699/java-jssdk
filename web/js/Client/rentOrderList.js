$(document).ready(function () {
    getLeaseOrderList();
});
function getLeaseOrderList() {
    $('.container-RentOrderList').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            var postData = {
                page_size: 8,
                page_index: $(".container-RentOrderList").attr("page"),
                status: 9
            }
            $.ajax({
                type: 'GET',
                url: config.server_url.get_rent_order_list,
                data: "json_body=" + JSON.stringify(postData),
                dataType: 'json',
                success: function (data) {
                    // 每次数据加载完，必须重置
                    $(".container-RentOrderList").attr("page", parseInt(postData.page_index) + 1);

                    if (data.rent_order_list != null && data.rent_order_list.length > 0) {
                        var html = '';
                        $.each(data.rent_order_list,
                            function (i, n) {
                                var statusName = "";
                                switch(n.status) {
                                    case 1:
                                        statusName = "已支付";
                                        break;
                                    case 2:
                                        statusName = "未支付";
                                        break;
                                    case 3:
                                        statusName = "已退款";
                                        break;

                                }
                                html += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg"> <div class="weui-media-box__hd"> <img class="weui-media-box__thumb" src="/images/robot.png"> </div> <div class="weui-media-box__bd">';
                                html += '<h4 class="weui-media-box__title">'+  n.robot_code +'</h4>';
                                html += '<p class="weui-media-box__desc">';
                                html += '<div class="weui-media-box__desc" style="float: left;">租用时间：'+ n.time_length +'天</div>';
                                html += '<div class="weui-media-box__desc" style="font-size:0.9rem;color:red;float: right;">'+accounting.formatNumber(n.amount / 100, 2)+'元</div>';
                                html += '</p> <p class="weui-media-box__desc zt">'+statusName+'</p> </div> </a>';
                                // html += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="/images/icon-robot.png"></div><div class="weui-media-box__bd"><h4 class="weui-media-box__title">' + n.robot_code + '</h4><p class="weui-media-box__desc">租用时间：' + n.time_length + '天</p></div><div class="weui-media-box__ft"><span href="javascript:;" class="weui-btn weui-btn_mini weui-btn_default">' + statusName + '<hr />￥' + accounting.formatNumber(n.amount / 100, 2) + '</span></div></a>';
                            });
                        $(".list-RentOrderList").append(html);
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