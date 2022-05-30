package datart.core.common;

import com.mysql.cj.util.StringUtils;

import java.nio.charset.CharsetEncoder;
import java.nio.charset.StandardCharsets;

public class SQLUtils {

    private static CharsetEncoder charsetEncoder = StandardCharsets.UTF_8.newEncoder();

    public static StringBuilder escapeSql(String str) {
        return StringUtils.escapeString(new StringBuilder(), str, false, charsetEncoder);
    }

    public static String escapeSql(String prefix, String str) {
        return escapeSql(new StringBuilder(prefix), str);
    }

    public static String escapeSql(StringBuilder buf, String str) {
        return StringUtils.escapeString(buf, str, false, charsetEncoder).toString();
    }

}
