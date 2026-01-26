package com.vantage.bank.transaction.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TransactionResponse {

    private UUID id;
    private Long amount;
    private String type;
    private LocalDateTime timestamp;
    private String sourceAccountNumber;
    private String targetAccountInfo;
}
