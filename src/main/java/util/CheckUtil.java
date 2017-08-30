package util;

import java.util.Arrays;

/**
 * Created by xu on 2017/7/10.
 */
public class CheckUtil
{
    private static final String token = "test";
    public static boolean checkSignature(String signature,String timestamp,String nonce)
    {
        String[] arr = new String[]{token,timestamp,nonce};
        //排序
        Arrays.sort(arr);
        //生成字符串
        StringBuffer content = new StringBuffer();
        for (int i=0;i<arr.length;i++)
        {
            content.append(arr[i]);
        }
        //sha1加密
        String temp = Decript.SHA1(content.toString());
        //校验签名
        return temp.equals(signature);
    }
}
