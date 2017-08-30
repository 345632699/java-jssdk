var config = {
    appid: 'wxf4aa8458e6176499',//正式
    server_url:
    {
        get_jssdk_Signature: '/Wechat/getJSSDKSignature',
        get_sales_network_list: '/robot/networkList',
        get_lease_order_list: '/client/getLeaseOrderList',
        check_user: '/Wechat/CheckUser',
        registered_user: '/client/create',
        send_sms: '/client/sendSms',
        lease_robot: '/robot/leaseRobot',
        get_user_info: '/Wechat/GetUserInfo',
        check_user_deposit: '/client/QueryUserTotalDeposit',
        create_lease_order: '/Wechat/CreateLeaseOrder',
        create_rent_wechat_pay: '/pay/createRentWechatPay',
        create_lease_wechat_pay: '/Wechat/CreateLeaseWechatPay',
        get_leased_robot_list: '/client/getLeasedRobotList',
        get_rent_order_list: '/client/getWaitPayList',
        return_robot: '/robot/doReturn',
        return_deposit: '/client/returnDeposit',
        get_sales_network_by_robot: '/robot/getSalesNetworkByRobot',
        get_jssdk_signature: '/robot/getJssdk',
        get_jssdk_location: '/robot/getLocationJssdk',
        business_cooperation: '/business/businessCooperation',
        get_pay_jsk_config: '/pay/getJsSdk',
        get_pay_config: '/pay/getPayConfig',
        get_business_jssdk: '/business/getConfig',
        get_question_list: '/contract/getQuestionList',
        get_recent_pay_config: '/pay/getRecentConfig',
        check_robot_rent: '/robot/checkRobotRent'
    },
    page_url:
    {
        mine_mine: '/client',
        mine_register: '/www/mine/register.html',
        pay_deposit: '/pay/payDeposit',
        lease_robot: '/robot/borrow',
        lease_robot_success: '/robot/leaseRobotSuccess',
        leaseRobotWaitConfirm: '/robot/leaseRobotWaitConfirm',
        pay_rent: '/pay/payRent',
        rent_order_list: '/client/rentOrderList',
        wait_pay_rent_order_list: '/client/waitPayList',
        return_robot_wait_confrm: '/robot/returnRobotWaitConfirm',
        pay_recent_rent: '/pay/payRecentRent',
    }
}
function goTo(url) {
    window.location.href = url;
}
function goBack(url) {
    window.history.go(-1);
}
function refreshPage() {
    window.location.reload();
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function serializeArrayToJson(serializeArray) {
    var data = serializeArray;
    var obj = {};
    $.each(data,
        function (i, v) {
            obj[v.name] = v.value;
        });
    return obj;
}
function showLoading(msg) {
    if (msg == null) {
        msg = "正在加载中...";
    }
    var loading = weui.loading(msg);
    return loading;
}
function showToast(msg, duration) {
    if (duration == null) {
        duration = 3000;
    }
    weui.toast(msg, {
        duration: duration

    });
}
function showTopTips(msg, duration) {
    if (duration == null) {
        duration = 3000;
    }
    weui.topTips(msg, {
        duration: duration

    });
}
function showAlert(msg, onClick, closeFlag) {
    if (closeFlag == null) {
        closeFlag = true;
    }
    var rtn = weui.alert(msg, function () {
        if (onClick != null) {
            onClick();
        }
        return closeFlag;
    });
    return rtn;
}
function showConfirm(msg, confirmClick, cancleClick, closeFlag) {
    if (closeFlag == null) {
        closeFlag = true;
    }
    var rtn = weui.confirm(msg, function () {
            if (confirmClick != null) {
                confirmClick();
            }
            return closeFlag;
        },
        function () {
            if (cancleClick != null) {
                cancleClick();
            }
        });
    return rtn;
}