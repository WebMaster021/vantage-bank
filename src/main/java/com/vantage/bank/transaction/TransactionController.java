package com.vantage.bank.transaction;

import com.vantage.bank.account.Account;
import com.vantage.bank.account.AccountRepository;
import com.vantage.bank.transaction.dto.TransactionRequest;
import com.vantage.bank.transaction.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @PostMapping
    public ResponseEntity<TransactionResponse> makeTransaction(@RequestBody TransactionRequest request, Principal connectedUser) {

        Transaction savedTransaction = transactionService.performTransaction(request, connectedUser.getName());

        TransactionResponse response = TransactionResponse.builder()
                .id(savedTransaction.getId())
                .amount(savedTransaction.getAmount())
                .type(savedTransaction.getType().toString())
                .timestamp(savedTransaction.getTimestamp())
                .sourceAccountNumber(savedTransaction.getAccount().getAccountNumber())
                .targetAccountInfo(savedTransaction.getTargetAccountId() != null ? savedTransaction.getTargetAccountId().toString() : "N/A")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(@PathVariable UUID accountId, Principal connectedUser) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        String ownerEmail = account.getUser().getEmail();
        String loggedInEmail = connectedUser.getName();

        if (!ownerEmail.equals(loggedInEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to view this account");
        }

        List<TransactionResponse> responseList = transactionRepository.findByAccountIdOrderByTimestampDesc(accountId)
                .stream()
                .map(tx -> TransactionResponse.builder()
                        .id(tx.getId())
                        .amount(tx.getAmount())
                        .type(tx.getType().toString())
                        .timestamp(tx.getTimestamp())
                        .sourceAccountNumber(tx.getAccount().getAccountNumber())
                        .targetAccountInfo(tx.getTargetAccountId() != null ? tx.getTargetAccountId().toString() : "N/A")
                        .build()
                )
                .toList();

        return ResponseEntity.ok(responseList);
    }
}
