CREATE TABLE transactions (
id UUID PRIMARY KEY,
account_id UUID NOT NULL,
amount BIGINT NOT NULL,
type VARCHAR(20) NOT NULL,
target_account_id UUID,
timestamp TIMESTAMP NOT NULL,
CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id),
CONSTRAINT fk_target_account FOREIGN KEY (target_account_id) REFERENCES accounts(id)
)