package com.tasty.tasty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.tasty.tasty")
public class TastyApplication {

    public static void main(String[] args) {
        SpringApplication.run(TastyApplication.class, args);
    }

}