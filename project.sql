CREATE DATABASE expense_tracker;

USE expense_tracker;

CREATE TABLE transactions (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    amount DOUBLE,
    type ENUM('income', 'expense')
);
