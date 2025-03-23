-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    amount REAL,
    date TEXT,
    description TEXT,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- Operations
CREATE TABLE IF NOT EXISTS operations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operation_type TEXT,
    status TEXT,
    customer_id INTEGER,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- Insert dummy customers
INSERT INTO customers (name, email) VALUES
('Alice Smith', 'alice@example.com'),
('Bob Johnson', 'bob@example.com');

-- Insert dummy transactions
INSERT INTO transactions (customer_id, amount, date, description) VALUES
(1, 100.50, '2024-01-01', 'Deposit'),
(2, -50.75, '2024-01-02', 'Withdrawal');

-- Insert dummy operations
INSERT INTO operations (operation_type, status, customer_id) VALUES
('Payment', 'Completed', 1),
('Transfer', 'Pending', 2);
