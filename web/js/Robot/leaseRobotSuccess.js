var rentOrderList = null;
$(document).ready(function () {
    getSalesNetworkByRobot();
});
function getSalesNetworkByRobot() {
    var postData = {
        robot_code: {
            robot_code_value: getQueryString("robotCode"),
            robot_code_type: getQueryString("robotCodeType")
        }
    }
    $.ajax({
        type: 'POST',
        cache: false,
        url: config.server_url.get_sales_network_by_robot,
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        success: function (data) {
            if (data.sales_network != null) {
                $("#label-ReturnPlace").text(data.sales_network.sales_network_name);
            }
        },
        error: function (xhr, type) {

        }
    });
}