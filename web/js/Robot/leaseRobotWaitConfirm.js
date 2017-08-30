var rentOrderList = null;
$(document).ready(function () {
    getLeasedRobotList();
});
function getLeasedRobotList() {
    var postData = {
        page_size: 8,
        page_index: 1,
        status: 1
    }
    $.ajax({
        type: 'POST',
        cache: false,
        url: config.server_url.get_leased_robot_list,
        data: "json_body=" + JSON.stringify(postData),
        dataType: 'json',
        success: function (data) {
            if (data.robot_code_list != null && data.robot_code_list.length > 0) {
                var robotCode = getQueryString("robotCode");
                var robotCodeType = getQueryString("robotCodeType");
                console.log(data);
                $.each(data.robot_code_list,
                    function (i, n) {
                        if (n.robot_code == robotCode || n.robot_id == robotCode) {
                            goTo(config.page_url.lease_robot_success + "?robotCode=" + robotCode + "&robotCodeType=" + robotCodeType);
                        }
                    });
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