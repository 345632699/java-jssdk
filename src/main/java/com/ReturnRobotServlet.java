package com;


import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.regexp.internal.RE;
import util.JdbcUtils;
import util.JdbcUtilsSingle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;

/**
 * Created by xu on 2017/7/12.
 */
@WebServlet(name = "ReturnRobotServlet")
public class ReturnRobotServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取前端传来的参数
        String all = request.getParameter("json_body");
        //解析json_body JSON数据
        JSONObject json = JSONObject.parseObject(all);
        String result_code = json.getString("robot_code");
        //解析result_code JSON数据
        JSONObject result = JSONObject.parseObject(result_code);
        String robot_code_value = result.getString("robot_code_value");
        String robot_code_type = result.getString("robot_code_type");

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        PrintWriter out = null;
        out = response.getWriter();
        //执行参数检查

        if ( result_code != null && !result_code.equals("") ){

            if (robot_code_value != null && !robot_code_value.equals("") && robot_code_type != null && !robot_code_type.equals(""))
            {
                try {
//                    // 加载数据库驱动，注册到驱动管理器
//                    Class.forName("com.mysql.jdbc.Driver");
//                    // 数据库连接字符串
//                    String url = "jdbc:mysql://localhost:3306/weixin?useUnicode=true&characterEncoding=utf-8";
//                    // 数据库用户名
//                    String username = "root";
//                    // 数据库密码
//                    String password = "root";
//                    // 创建Connection连接
//                    Connection conn = DriverManager.getConnection(url, username,
//                            password);

                    String nRId = null;
                    String sql = "SELECT UId FROM RUserBase WHERE ProductId='"+robot_code_value+"'";
                    // 获取Statement
                    ResultSet resultSet = null;

//                        Statement statement = conn.createStatement();
//                    Statement statement = conn.prepareStatement(sql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);

                    if (robot_code_type.equals("1"))
                    {
//                        resultSet = statement.executeQuery(sql);
                        Map<String, Object> resMap = read(sql);
                        if (resMap==null)
                        {
                            String res = "{\"result_code\":20003,\"result_message\":\"机器人不存在\"}";
                            out.write(res);
                            return;
                        }
//                        nRId = resultSet.getString("UId");
                        nRId = resMap.get("UId").toString();
                    }else{
                        nRId = robot_code_value;
                    }
                    //关闭statement后，获取对象
//                    resultSet.last();
                    //查询机器人状态
                    String sql2 = "SELECT cal_start_time,method,frozen,user_id FROM RentBill INNER JOIN RobotStock ON RentBill.robot_id=RobotStock.robot_id WHERE RentBill.robot_id="+nRId+" AND success_time IS NULL";

//                    ResultSet resultForRentBill = statement.executeQuery(sql2);
                    Map<String, Object> resultForRentBillMap = read(sql2);
//                    resultForRentBill.next();
//                    String open_id = resultForRentBill.getString("user_id");
//                    resultForRentBill.last();
                    String open_id = null;
                    TimeZone tz = TimeZone.getTimeZone("Asia/Shanghai");
                    TimeZone.setDefault(tz);//设置默认时区
                    Long currentTime = null;
                    Integer nTimestampGap = null;
                    if (resultForRentBillMap == null)
                    {
                        String res = "{\"result_code\":20003,\"result_message\":\"所请求机器人不在租赁中状态\"}";
                        out.write(res);
                        return;
                    }else if (!resultForRentBillMap.get("frozen").equals(false)){
                        String res = "{\"result_code\":20003,\"result_message\":\"所请求机器人已冻结，不能归还\"}";
                        out.write(res);
                        return;
                    }else if (resultForRentBillMap.get("method").toString().equals("1")){
                        open_id = (String) resultForRentBillMap.get("user_id");
                        currentTime = System.currentTimeMillis() / 1000;
                        String nStartTimestamp = resultForRentBillMap.get("cal_start_time").toString();
                        String middle = String.valueOf(currentTime/1000);
                        Integer currentTimeInt = Integer.valueOf(middle);

                        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        Date date = simpleDateFormat.parse(nStartTimestamp);

                        nTimestampGap = currentTimeInt - (int) date.getTime() / 1000;
                        System.out.println("nStartTimestamp"+ date.getTime());
                        System.out.println("currentTime"+currentTime);
                        System.out.println("nTimestampGap"+nTimestampGap);
                        System.out.println(resultForRentBillMap.get("cal_start_time"));

                        if ( nTimestampGap / 86400 > 9999){
                            String sql3 = "UPDATE RobotStock SET frozen=1 WHERE robot_id="+nRId+" AND user_platform=0";
                            update(sql3);
                            String sql4 = "UPDATE Deposit SET frozen=1 WHERE user_id='"+open_id+"' AND platform=0 AND success_time IS NOT NULL AND refund_time IS NULL AND frozen=0 ORDER BY create_time ASC LIMIT 1";
                            update(sql4);
                            String res = "{\"result_code\":20003,\"result_message\":\"所请求机器人已超出租赁时限，不能归还\"}";
                            out.write(res);
                            return;
                        }

                    }else{
                        String res = "{\"result_code\":20003,\"result_message\":\"所请求机器人不在租赁中状态\"}";
                        out.write(res);
                        return;
                    }
                    Integer time = Integer.valueOf(String.valueOf(System.currentTimeMillis()/1000));
                    String updateMethodSql = "UPDATE RobotStock SET method=2,expire_time="+time+" WHERE robot_id="+nRId+" AND bind_user_id='"+open_id+"' AND user_platform=0 AND method IN(1,2)";
                    update(updateMethodSql);

                    String selectRobotStockSql = "SELECT RobotStock.branch_id,`name`,`method`,`expire_time`,`bind_user_id`,`user_platform` FROM `RobotStock` INNER JOIN BranchInfo ON BranchInfo.branch_id=RobotStock.branch_id WHERE `robot_id`="+nRId;
//                    ResultSet RobotStockRes = statement.executeQuery(selectRobotStockSql);
                    System.out.println(selectRobotStockSql);
                    String bind_user_id = null;
                    Integer user_platform = null;
                    Integer branch_id = null;
                    Map<String, Object> RobotStockRes = read(selectRobotStockSql);
//                    RobotStockRes.last();
                    if (RobotStockRes == null){
                        String res = "{\"result_code\":20003,\"result_message\":\"无效的机器人库存信息\"}";
                        out.write(res);
                        return;
                    }else{
                        Long now =  System.currentTimeMillis();
                        Integer expire_time = (Integer) RobotStockRes.get("expire_time");
                        if (expire_time == null)
                        {
                            expire_time = 0;
                        }
                        bind_user_id = (String) RobotStockRes.get("bind_user_id");
                        user_platform = (Integer) RobotStockRes.get("user_platform");
                        branch_id = (Integer) RobotStockRes.get("branch_id");
                        System.out.println(bind_user_id);
                        System.out.println(open_id);
                        if (!bind_user_id.equals(open_id))
                        {
                            String res = "{\"result_code\":20003,\"result_message\":\"机器人与租借人关联订单不一致\"}";
                            out.write(res);
                            return;
                        }

                        //执行归还计算租金操作
                        Double nBaseAmount = 100 * ( Math.floor(nTimestampGap / 86400) + ((nTimestampGap % 86400) > 0 ? 1 : 0));
                        //锁定失败或余额不足，使用非余额支付
                        String updateRentBillSql = "UPDATE `RentBill` SET `cal_end_time`=NOW(),`return_branch_id`="+branch_id+",`base_rental`="+nBaseAmount+" WHERE `robot_id`="+nRId+" AND `user_id`='"+open_id+"' AND `platform`="+user_platform+" AND `cal_end_time` IS NULL";
                        Integer xResult = update(updateRentBillSql);
                        if (xResult.equals(0))
                        {
                            String res = "{\"result_code\":20003,\"result_message\":\"更新租赁单失败\"}";
                            out.write(res);
                            return;
                        }
                        String upadtesql1 = "UPDATE `RobotStock` SET `bind_user_id`=NULL,`user_platform`=NULL,`method`=NULL,`expire_time`=NULL WHERE `robot_id`="+nRId+" AND `method`=2";
                        String updateRobotStockSql = "UPDATE `RobotStock` SET `method`=3 WHERE `robot_id`="+nRId+" AND `frozen`=0 AND `method`=2";
                        Integer xResult1 = update(upadtesql1);
                        if (xResult1.equals(0))
                        {
                            String res = "{\"result_code\":20003,\"result_message\":\"租赁订单更新失败\"}";
                            out.write(res);
                            return;
                        }

                        String res = "{\"result_code\":0,\"result_message\":\"调用成功\"}";
                        out.write(res);
                        return;
//                        if (expire_time.equals(0) || (expire_time) > now)
//                        {
//                            return;
//                        }
//                        if (RobotStockRes.get("method").toString().equals("2") || RobotStockRes.get("method").toString().equals("3")) {
////                            String updatesql1 = "UPDATE `RobotStock` SET `method`=1 WHERE `robot_id`="+nRId+" AND `method` IN (2,3) AND `expire_time`<="+now;
//                            String upadtesql1 = "UPDATE `RobotStock` SET `bind_user_id`=NULL,`user_platform`=NULL,`method`=NULL,`expire_time`=NULL WHERE `robot_id`="+nRId+" AND `method`=0 AND `expire_time`<="+now;
//                            update(upadtesql1);
//                            String updatesql2 = "UPDATE `RentBill` SET `cal_end_time`=NULL WHERE `robot_id`="+nRId+" AND `success_time` IS NULL";
//                            update(updatesql2);
//                        }else {
//                            String upadtesql1 = "UPDATE `RobotStock` SET `bind_user_id`=NULL,`user_platform`=NULL,`method`=NULL,`expire_time`=NULL WHERE `robot_id`="+nRId+" AND `method`=0 AND `expire_time`<="+now;
//                            update(upadtesql1);
//                            String updatesql2 = "UPDATE `RentBill` SET `cal_end_time`=NULL WHERE `robot_id`="+nRId+" AND `success_time` IS NULL";
//                            update(updatesql2);
//                        }
                    }
                    //关闭数据库的连接，释放资源
//                    statement.close();
//                    resultSet.close();
//                    resultForRentBill.close();
//                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }else{
                String res =  "{\"result_code\":20001,\"result_message\":\"缺少参数或参数类型不正确\"}";
                out.write(res);
                return;
            }
        }else{
            String res = "{\"result_code\":20001,\"result_message\":\"缺少参数或参数类型不正确\"}";
            out.write(res);
            return;
        }

        //连接数据库操作


    }

    public static Map<String, Object> ResultSetToList(ResultSet resultSet) throws Exception
    {
        ResultSet rs = resultSet;
        ResultSetMetaData md = (ResultSetMetaData) rs.getMetaData();
        int columnCount = md.getColumnCount();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        while (rs.next()) {
            Map<String, Object> rowData = new HashMap<String, Object>();
            for (int i = 1; i <= columnCount; i++) {
                rowData.put(md.getColumnName(i), rs.getObject(i));
            }
            list.add(rowData);
        }
        if(null == list || list.size() ==0 ){
            return null;

        }else{
            return list.get(0);
        }

    }

    public static Integer update(String sql) throws SQLException
    {
        Connection conn=null;
        Statement st=null;
        ResultSet resultset=null;

        try {
            //2.建立连接
            conn= JdbcUtils.getConnection();
            //单例设计模式
//            conn=JdbcUtilsSingle.getInstance().getConnection();
            //3.创建语句
            st=conn.createStatement();
            //4.执行语句
            int i=st.executeUpdate(sql);
            return i;
        } finally
        {
            JdbcUtils.free(resultset, st, conn);
        }
    }

    public static Map<String, Object> read(String sql) throws SQLException
    {
        Connection conn=null;
        Statement st=null;
        ResultSet resultset=null;
        Map<String, Object> res = null;
        try {
            //2.建立连接
            conn=JdbcUtils.getConnection();
            //单例设计模式
//            conn= JdbcUtilsSingle.getInstance().getConnection();
            //3.创建语句
//            st=conn.createStatement();
            st = conn.prepareStatement(sql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
            //4.执行语句
            resultset=st.executeQuery(sql);
            //5.处理结果

            res = ResultSetToList(resultset);

        } catch (Exception e) {
            e.printStackTrace();
        } finally
        {
            JdbcUtils.free(resultset, st, conn);
        }
        return res;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String all = request.getParameter("json_body");
        PrintWriter out = null;
        out = response.getWriter();
        out.write(all);
    }


}
