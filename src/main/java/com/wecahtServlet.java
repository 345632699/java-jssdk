package com;

import com.sun.tools.classfile.Signature;
import util.CheckUtil;
import util.Sign;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by xu on 2017/7/10.
 */
@WebServlet(name = "wecahtServlet")
public class wecahtServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String signature = request.getParameter("signature");
        String timestamp = request.getParameter("timestamp");
        String nonce = request.getParameter("nonce");
        String echostr = request.getParameter("echostr");

        if( CheckUtil.checkSignature(signature,timestamp,nonce))
        {
            response.getWriter().println(echostr);
        }
    }

}
