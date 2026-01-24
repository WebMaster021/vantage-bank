package com.vantage.bank.account;

import com.vantage.bank.account.dto.CreateAccountRequest;
import com.vantage.bank.user.User;
import com.vantage.bank.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public Account createAccount(CreateAccountRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Account account = Account.builder()
                .user(user)
                .accountNumber(generateAccountNumber())
                .type(request.getType())
                .balance(0L)
                .currency("USD")
                .build();

        return accountRepository.save(account);
    }

    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
