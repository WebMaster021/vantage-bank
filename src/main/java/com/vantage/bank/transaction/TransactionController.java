package com.vantage.bank.transaction;

import com.vantage.bank.account.Account;
import com.vantage.bank.account.AccountRepository;
import com.vantage.bank.transaction.dto.TransactionRequest;
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
    public ResponseEntity<Transaction> makeTransaction(@RequestBody TransactionRequest request, Principal connectedUser) {
        return ResponseEntity.ok(transactionService.performTransaction(request, connectedUser.getName()));
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable UUID accountId, Principal connectedUser) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        String ownerEmail = account.getUser().getEmail();
        String loggedInEmail = connectedUser.getName();

        if (!ownerEmail.equals(loggedInEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to view this account");
        }

        return ResponseEntity.ok(transactionRepository.findByAccountIdOrderByTimestampDesc(accountId));
    }
}
