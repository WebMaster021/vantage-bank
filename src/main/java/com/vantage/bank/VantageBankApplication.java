package com.vantage.bank;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@OpenAPIDefinition(
        info = @Info(
                title = "Vantage Bank API",
                version = "1.0",
                description = "Banking API"
        ),
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)

@SecurityScheme(
        name = "bearerAuth",
        description = "JWT Authorization",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)

@SpringBootApplication
public class VantageBankApplication {

	public static void main(String[] args) {
		SpringApplication.run(VantageBankApplication.class, args);
	}

}
