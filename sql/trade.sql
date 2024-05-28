CREATE DATABASE trade_db;

-- CockroachDB only
USE trade_db;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username STRING UNIQUE NOT NULL,
    password_hash STRING NOT NULL,
    email STRING UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE accounts (
    account_nbr STRING PRIMARY KEY UNIQUE NOT NULL,
    user_id UUID REFERENCES users(user_id),
    account_id UUID DEFAULT gen_random_uuid(),
    balance DECIMAL(20, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE instruments (
    symbol STRING PRIMARY KEY UNIQUE NOT NULL,
    name STRING NOT NULL,
    current_price DECIMAL(20, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_nbr STRING UNIQUE NOT NULL,
    account_nbr STRING NOT NULL,
    symbol STRING NOT NULL,
    order_entry_ts TIMESTAMPTZ DEFAULT now(),
    total_qty INT NOT NULL,
    order_type STRING NOT NULL,
    unit_price DECIMAL(20, 2) NOT NULL,
    CONSTRAINT fk_symbol FOREIGN KEY (symbol) REFERENCES instruments(symbol),
    CONSTRAINT fk_account FOREIGN KEY (account_nbr) REFERENCES accounts(account_nbr)
);

CREATE TABLE order_activity (
    activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id),
    order_nbr STRING NOT NULL,
    order_status STRING NOT NULL,
    activity_entry_ts TIMESTAMPTZ DEFAULT now(),
    symbol STRING NOT NULL,
    total_qty INT NOT NULL,
    order_type STRING NOT NULL,
    unit_price DECIMAL(20, 2) NOT NULL,
    CONSTRAINT fk_orderid FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_symbol FOREIGN KEY (symbol) REFERENCES instruments(symbol)
);

CREATE TABLE order_processing (
    execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id),
    order_status STRING NOT NULL,
    order_nbr STRING NOT NULL,
    order_executed_ts TIMESTAMPTZ DEFAULT now(),
    symbol STRING NOT NULL,
    total_qty INT NOT NULL,
    unit_price DECIMAL(20, 2) NOT NULL,
    CONSTRAINT fk_orderid FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_symbol FOREIGN KEY (symbol) REFERENCES instruments(symbol)
);


CREATE TABLE trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID REFERENCES order_processing(execution_id),
    symbol STRING NOT NULL,
    order_type STRING NOT NULL,
    trade_price DECIMAL(20, 2) NOT NULL,
    quantity INT NOT NULL,
    trade_ts TIMESTAMPTZ DEFAULT now()
); /* add constraint on forgein key  */


