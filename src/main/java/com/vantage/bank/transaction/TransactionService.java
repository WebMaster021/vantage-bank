package com.vantage.bank.transaction;

import com.vantage.bank.account.Account;
import com.vantage.bank.account.AccountRepository;
import com.vantage.bank.transaction.dto.TransactionRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Transaction performTransaction(TransactionRequest request, String username) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUser().getEmail().equals(username)) {
            throw new RuntimeException("You don't own this account");
        }

        long amountInCents = request.getAmount().multiply(new java.math.BigDecimal("100")).longValue();

        if (request.getType() == TransactionType.DEPOSIT) {
            account.setBalance(account.getBalance() + amountInCents);

        } else if (request.getType() == TransactionType.WITHDRAWAL) {
            if (account.getBalance() < amountInCents) {
                throw new RuntimeException("Insufficient funds");
            }
            account.setBalance(account.getBalance() - amountInCents);

        } else if (request.getType() == TransactionType.TRANSFER) {
            if (request.getTargetAccountId() == null) {
                throw new RuntimeException("Target account ID is required for transfers");
            }
            if (account.getId().equals(request.getTargetAccountId())) {
                throw new RuntimeException("Cannot transfer money to the same account");
            }
            if (account.getBalance() < amountInCents) {
                throw new RuntimeException("Insufficient funds for transfer");
            }

            Account targetAccount = accountRepository.findById(request.getTargetAccountId())
                    .orElseThrow(() -> new RuntimeException("Target account not found"));

            account.setBalance(account.getBalance() - amountInCents);
            targetAccount.setBalance(targetAccount.getBalance() + amountInCents);

            accountRepository.save(targetAccount);

            Transaction creditTx = Transaction.builder()
                    .account(targetAccount)
                    .amount(amountInCents)
                    .type(TransactionType.DEPOSIT)
                    .status(TransactionStatus.COMPLETED)
                    .timestamp(LocalDateTime.now())
                    .targetAccountId(account.getId())
                    .build();
            transactionRepository.save(creditTx);

        }
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .account(account)
                .amount(amountInCents)
                .type(request.getType())
                .status(TransactionStatus.COMPLETED)
                .timestamp(LocalDateTime.now())
                .targetAccountId(request.getTargetAccountId())
                .build();

        return transactionRepository.save(transaction);
    }
}
