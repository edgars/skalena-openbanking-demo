# 🏦 OpenBanking API – Node.js + SQLite + Docker

A lightweight Open Banking-style API built with Node.js, Express, and SQLite, designed to run in a **single Docker container** with **pre-populated data**. Supports routes to manage customers, transactions, and operations – perfect for fintech demos, prototypes, or learning microservices.

----------

## 🚀 Features

-   🔹 REST API built with Express.js
-   🔹 SQLite database persisted in Docker image
-   🔹 Pre-seeded with sample data (customers, transactions, operations)
-   🔹 Lightweight & easy to deploy via Docker
-   🔹 Open Banking-style route design

----------

## 📂 Project Structure

pgsql

CopyEdit

`openbanking-api/
├── db/
│   └── seed.sql # SQL  schema + seed data
├── server/
│   ├── index.js              # Express server │   └── db.js                 # SQLite helper module
├── package.json
├── Dockerfile
├── README.md` 

----------

## ⚙️ API Endpoints

Method

Route

Description

GET

`/customers`

List all customers

POST

`/customers`

Create a new customer

GET

`/transactions`

List all transactions

POST

`/transactions`

Create a new transaction

GET

`/operations`

List all operations

POST

`/operations`

Create a new operation

----------

## 🐳 Docker: Build & Run

### 1. Build Docker Image

bash

CopyEdit

`docker build -t openbanking-api .` 

### 2. Run Container

bash

CopyEdit

`docker run -p 3000:3000 openbanking-api` 

### 3. Access API

bash

CopyEdit

`http://localhost:3000/customers` 

----------

## 🗃️ Sample Data

Pre-loaded via `db/seed.sql`:

-   **Customers**: Alice Smith, Bob Johnson
-   **Transactions**: Deposits, Withdrawals
-   **Operations**: Payments, Transfers

----------

## 📦 Dependencies

-   Node.js 18+
-   Express
-   SQLite3
-   Docker

----------

## ✨ Future Enhancements (PRs Welcome!)

-   Swagger/OpenAPI documentation
-   JWT-based Authentication
-   Filtering & Pagination
-   Docker Compose for multi-container setups (PostgreSQL, Redis, etc.)
