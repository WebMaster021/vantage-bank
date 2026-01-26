package com.vantage.bank.account;

import com.vantage.bank.account.dto.AccountResponse;
import com.vantage.bank.account.dto.CreateAccountRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final AccountRepository accountRepository;

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody CreateAccountRequest request, Principal connectedUser) {
        return ResponseEntity.ok(accountService.createAccount(request, connectedUser.getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<AccountResponse> getMyAccount(Principal connectedUser) {
        String email = connectedUser.getName();

        Account account = accountRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("No account found for this user"));

        AccountResponse response = AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .fullName(account.getUser().getFullName())
                .email(account.getUser().getEmail())
                .build();

        return ResponseEntity.ok(response);
    }
}