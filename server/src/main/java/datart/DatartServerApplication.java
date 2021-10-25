package datart;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"datart"})
public class DatartServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatartServerApplication.class, args);
    }

//    @Bean
//    public ServletRegistrationBean<StatViewServlet> druidStatViewServlet() {
//        ServletRegistrationBean<StatViewServlet> registrationBean = new ServletRegistrationBean<>(new StatViewServlet(), "/druid/*");
//        registrationBean.addInitParameter("allow", "127.0.0.1");
//        registrationBean.addInitParameter("deny", "");
//        registrationBean.addInitParameter("loginUsername", "root");
//        registrationBean.addInitParameter("loginPassword", "1234");
//        registrationBean.addInitParameter("resetEnable", "false");
//        return registrationBean;
//    }


}