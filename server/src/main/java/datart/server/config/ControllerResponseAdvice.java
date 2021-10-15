//package datart.server.config;
//
//import datart.server.base.dto.ResponseData;
//import datart.server.controller.BaseController;
//import org.springframework.core.MethodParameter;
//import org.springframework.http.MediaType;
//import org.springframework.http.converter.HttpMessageConverter;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
//
//import java.util.Objects;
//
//@ControllerAdvice
//public class ControllerResponseAdvice implements ResponseBodyAdvice<Object> {
//    @Override
//    public boolean supports(MethodParameter methodParameter, Class<? extends HttpMessageConverter<?>> aClass) {
//        Class<?> superclass = Objects.requireNonNull(methodParameter.getMethod()).getDeclaringClass().getSuperclass();
//        return BaseController.class.equals(superclass);
//    }
//
//    @Override
//    public Object beforeBodyWrite(Object o, MethodParameter methodParameter, MediaType mediaType, Class<? extends HttpMessageConverter<?>> aClass, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {
//        if (o instanceof ResponseData) {
//            return o;
//        } else {
//            return ResponseData.success(o);
//        }
//    }
//}