package datart;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"datart"})
public class DatartServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatartServerApplication.class, args);
    }

}