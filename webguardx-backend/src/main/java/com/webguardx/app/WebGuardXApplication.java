package com.webguardx.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.context.annotation.ComponentScan(basePackages = {"com.webguardx"})
@org.springframework.data.mongodb.repository.config.EnableMongoRepositories(basePackages = {"com.webguardx"})
@org.springframework.scheduling.annotation.EnableScheduling
public class WebGuardXApplication {

	public static void main(String[] args) {

		SpringApplication.run(WebGuardXApplication.class, args);
	}

}


