package datart.server.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import datart.core.base.exception.Exceptions;
import datart.core.common.JavascriptUtils;
import datart.server.base.params.DownloadCreateParam;

import javax.script.Invocable;
import javax.script.ScriptException;

public class JsParserUtils {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private static Invocable parser;

    static {
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static DownloadCreateParam parseExecuteParam(String type, String json) throws ScriptException, NoSuchMethodException, JsonProcessingException {
        Invocable parser = getParser();
        if (parser == null) {
            Exceptions.msg("param parser load error");
        }
        Object result = parser.invokeFunction("getQueryData", type, json);
        return OBJECT_MAPPER.readValue(result.toString(), DownloadCreateParam.class);
    }

    private static synchronized Invocable getParser() {
        if (parser == null) {
            try {
                parser = JavascriptUtils.load("javascript/parser.js");
            } catch (Exception e) {
                Exceptions.e(e);
            }
        }
        return parser;
    }
}
