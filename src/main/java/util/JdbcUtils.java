package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class JdbcUtils
{
    private static String url="jdbc:mysql://xxxx/weixin?useUnicode=true&characterEncoding=utf-8";
    private static String user="xxxx";
    private static String password="xxxx";
    private JdbcUtils()
    {
    }
    static
    {
        try
        {
            Class.forName("com.mysql.jdbc.Driver");
        }
        catch(ClassNotFoundException e)
        {
            throw new ExceptionInInitializerError(e);
        }
    }
    public static Connection getConnection() throws SQLException
    {
        return DriverManager.getConnection(url, user, password);
    }
    public static void free(ResultSet resultset,Statement st,Connection conn)
    {
        //6.释放资源

        try{
            if(resultset!=null)
                resultset.close();
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        finally
        {
            try
            {
                if(st!=null)
                    st.close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            finally
            {
                if(conn!=null)
                    try {
                        conn.close();
                    } catch (SQLException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
            }
        }
    }
}
