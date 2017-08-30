package util;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public final class JdbcUtilsSingle {

    private static String url="jdbc:mysql://xxxx/weixin?useUnicode=true&characterEncoding=utf-8";
    private String user = "xxxx";
    private String password = "xxxx";

// private static JdbcUtilsSingle instance = new JdbcUtilsSingle();

    private static JdbcUtilsSingle instance = null;

    private JdbcUtilsSingle(){

    }

    public static JdbcUtilsSingle getInstance(){//jdk1.5以上版本才能完全正常运行
        if(instance == null){
            synchronized (JdbcUtilsSingle.class) {
                if(instance == null)//双重加锁
                    instance = new JdbcUtilsSingle();
            }

        }
        return instance;
    }

    static{
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            throw new ExceptionInInitializerError(e);
        }
    }

    public  Connection getConnection() throws SQLException{
        return  DriverManager.getConnection(url,user,password);
    }

    public  void free(ResultSet rs,Statement st,Connection conn){
        try{
            if(rs!=null)
                rs.close();
        }catch (SQLException e){
            e.printStackTrace();
        }
        finally{
            try{
                if(st!=null)
                    st.close();
            }catch (SQLException e){
                e.printStackTrace();
            }
            finally{
                if(conn!=null)
                    try{
                        conn.close();
                    }
                    catch (SQLException e){
                        e.printStackTrace();
                    }

            }

        }
    }
}




