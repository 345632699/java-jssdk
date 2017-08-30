<%--
  Created by IntelliJ IDEA.
  User: xu
  Date: 2017/7/12
  Time: 下午2:56
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="full-screen" content="yes">
    <meta name="x5-fullscreen" content="true">
    <title>还机器人</title>
    <link href="plugin/weui/weui.min.css" rel="stylesheet" />
    <link href="css/mobile-main.css" rel="stylesheet" />
    <script src="plugin/zepto/zepto.min.js"></script>
    <script src="plugin/weui/weui.min.js"></script>
    <script charset="utf-8" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="js/function.js"></script>
    <script src="js/Robot/refundRobot.js"></script>
</head>
<body>
<div class="page">
    <div class="weui-msg">
        <div class="weui-msg__icon-area"><i class="weui-icon-waiting weui-icon_msg"></i></div>
        <div class="weui-msg__text-area">
            <h2 class="weui-msg__title">还机器人</h2>
            <p class="weui-msg__desc">点击扫码退还按钮进行还机器人</p>
        </div>
        <div class="weui-msg__opr-area">
            <p class="weui-btn-area">
                <a href="javascript:void(0);" class="weui-btn weui-btn_primary" onclick="scanQRCode()">扫码退还</a>
            </p>
        </div>
    </div>
</div>
</body>
</html>
