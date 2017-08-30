var rentOrderList = null;
$(document).ready(function () {
    getLeasedRobotList();
});
function getLeasedRobotList() {
    var postData = {
        page_size: 8,
        page_index: 1,
        status: 3
    }
    $.ajax({
        type: 'POST',
        cache: false,
        url: config.server_url.get_rent_order_list,
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        success: function (data) {
            if (data.rent_order_list != null && data.rent_order_list.length > 0) {
                goTo(config.page_url.wait_pay_rent_order_list);
                // console.log(data.rent_order_list.length);
            }
            setTimeout(function () {
                    getLeasedRobotList();
                },
                500);
        },
        error: function (xhr, type) {

        }
    });
}
