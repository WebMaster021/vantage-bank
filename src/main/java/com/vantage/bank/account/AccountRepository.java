package com.vantage.bank.account;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findByUser_Email(String email);

    boolean existsByAccountNumber(String accountNumber);
}
