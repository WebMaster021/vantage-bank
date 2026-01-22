CREATE TABLE transactions (
id UUID PRIMARY KEY,
account_id UUID NOT NULL,
amount BIGINT NOT NULL,
type VARCHAR(20) NOT NULL,
timestamp TIMESTAMP NOT NULL,
CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id)
)