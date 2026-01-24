package com.vantage.bank.transaction.dto;

import com.vantage.bank.transaction.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    private UUID accountId;
    private BigDecimal amount;
    private TransactionType type;
    private UUID targetAccountId;
}
