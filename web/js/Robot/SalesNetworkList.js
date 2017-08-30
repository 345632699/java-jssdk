var map = null;
$(document).ready(function () {
    var dialogLoading = showLoading();
    //获取配置信息
    $.ajax({
        type: 'POST',
        url: config.server_url.get_jssdk_location,
        dataType: 'json',
        success: function (data) {
            wx.config(data);
            wx.ready(function () {
                dialogLoading.hide();
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        getSalesNetworkList(latitude, longitude);
                        //showAlert(latitude+':'+longitude);
                    },
                    error: function () {
                        showAlert("获取定位出错");
                    }
                });
            });
        },
        error: function (xhr, type) {
            showAlert("getJSSDKSignature出错");
        },
    });
});
function getSalesNetworkList(lat, lng) {
    try {
        var myLatlng = new qq.maps.LatLng(lat, lng);
        var myOptions = {
            zoom: 12,
            center: myLatlng,
            mapTypeId: qq.maps.MapTypeId.ROADMAP
        }
        map = new qq.maps.Map(document.getElementById("box-Map"), myOptions);
        var dialogLoading = showLoading();
        $('.container-SalesNetwork').dropload({
            loadDownFn: function (me) {
                var postData = {
                    longitude: lng,
                    latitude: lat,
                    page_size: 8,
                    page_index: $(".container-SalesNetwork").attr("page")
                }
                $.ajax({
                    type: 'GET',
                    url: config.server_url.get_sales_network_list,
                    data: "json_body=" + JSON.stringify(postData),
                    dataType: "json",
                    success: function (data) {
                        // 每次数据加载完，必须重置
                        $(".container-SalesNetwork").attr("page", parseInt(postData.page_index) + 1);
                        if (data.sales_network_list != null && data.sales_network_list.length > 0) {
                            var html = '';
                            $.each(data.sales_network_list,
                                function (i, n) {
                                    html += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" onclick="goToPosition(' + n.latitude + ',' + n.longitude + ')"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="/images/icon-list-default.png"></div><div class="weui-media-box__bd"><h4 class="weui-media-box__title">' + n.sales_network_name + '</h4><p class="weui-media-box__desc">' + n.detailed_address + '</p></div><div class="weui-media-box__ft"><div class="clearfix box-numbers"><div class="item"><span class="indicator" max="' + n.total + '" current="' + n.surplus + '" color="#87CEEB"></span><span class="indicator-name">可借</span></div></div></div></a>';
                                    var latLng = new qq.maps.LatLng(n.latitude, n.longitude);
                                    var marker = new qq.maps.Marker({
                                        map: map
                                    });
                                    marker.setPosition(latLng);
                                });
                            $(".list-SalesNetwork").append(html);
                            var list = $('.indicator');
                            $.each(list,
                                function (i, n) {
                                    $(n).removeClass('indicator');
                                    var radialObj = radialIndicator(n, {
                                        barColor: $(n).attr("color"),
                                        barWidth: 3,
                                        initValue: $(n).attr("current"),
                                        maxValue: $(n).attr("max"),
                                        radius: 13
                                    });
                                });
                        }
                        if (data.page_count <= 8 || data.page_count == 0 ) {
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                            dialogLoading.hide();
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
    } catch (e) {
        showAlert("加载地图错误，请重新尝试", function() {
            refreshPage();
        });
    }
}
function goToPosition(lat, lng) {
    map.panTo(new qq.maps.LatLng(lat, lng));
}
wx.error(function (res) {
    showAlert("微信接口出错");
});