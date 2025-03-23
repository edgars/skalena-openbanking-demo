const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Config
const CUSTOMER_COUNT = 14;
const MIN_TX = 30;
const MAX_TX = 40;
const START_DATE = new Date(2024, 0, 1); // Jan 1, 2024
const END_DATE = new Date(2024, 1, 29);  // Feb 29, 2024
const DESCRIPTIONS = ['Deposit', 'Withdrawal', 'Payment', 'Transfer', 'Refund', 'Purchase', 'Salary', 'Cashback'];
const DOMAIN = 'example.com';

// Sample name pools
const FIRST_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Ian', 'Jane', 'Kevin', 'Laura', 'Michael', 'Nina', 'Oscar', 'Paula', 'Quincy', 'Rachel', 'Steve', 'Tina'];
const LAST_NAMES = ['Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

// Helpers
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate() {
    const diff = END_DATE.getTime() - START_DATE.getTime();
    const newDate = new Date(START_DATE.getTime() + Math.random() * diff);
    return newDate.toISOString().split('T')[0];
}

function randomAmount() {
    return (Math.random() * 2000 - 1000).toFixed(2); // -1000 to +1000
}

function sanitizeEmail(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Generate customers with random names/emails
function generateCustomers() {
    const customers = [];
    const usedEmails = new Set();

    while (customers.length < CUSTOMER_COUNT) {
        const firstName = randomItem(FIRST_NAMES);
        const lastName = randomItem(LAST_NAMES);
        const fullName = `${firstName} ${lastName}`;
        let email = `${sanitizeEmail(firstName)}.${sanitizeEmail(lastName)}@${DOMAIN}`;

        // Ensure unique email
        let count = 1;
        while (usedEmails.has(email)) {
            email = `${sanitizeEmail(firstName)}.${sanitizeEmail(lastName)}${count}@${DOMAIN}`;
            count++;
        }

        usedEmails.add(email);
        const id = uuidv4();
        customers.push({ id, name: fullName, email });
    }

    return customers;
}

function buildCustomerSQL(customers) {
    let sql = '-- Insert Customers\nINSERT INTO customers (id, name, email) VALUES\n';
    sql += customers.map((c, idx) => `('${c.id}', '${c.name}', '${c.email}')${idx === customers.length - 1 ? ';' : ','}\n`).join('');
    return sql + '\n';
}

function buildTransactionSQL(customers) {
    let sql = '-- Insert Transactions\nINSERT INTO transactions (id, customer_id, amount, date, description) VALUES\n';
    const values = [];

    customers.forEach((cust) => {
        const txCount = Math.floor(Math.random() * (MAX_TX - MIN_TX + 1)) + MIN_TX;
        for (let i = 0; i < txCount; i++) {
            const txId = uuidv4();
            const amount = randomAmount();
            const date = randomDate();
            const desc = randomItem(DESCRIPTIONS);
            values.push(`('${txId}', '${cust.id}', ${amount}, '${date}', '${desc}')`);
        }
    });

    sql += values.map((v, idx) => `${v}${idx === values.length - 1 ? ';' : ','}\n`).join('');
    return sql + '\n';
}

function buildOperationSQL(customers) {
    const OP_TYPES = ['Payment', 'Transfer', 'Top-up', 'Withdrawal'];
    const STATUSES = ['Completed', 'Pending', 'Failed'];

    let sql = '-- Insert Operations\nINSERT INTO operations (id, operation_type, status, customer_id) VALUES\n';
    const values = customers.map((cust, idx) => {
        const opId = uuidv4();
        const opType = OP_TYPES[idx % OP_TYPES.length];
        const status = STATUSES[idx % STATUSES.length];
        return `('${opId}', '${opType}', '${status}', '${cust.id}')`;
    });

    sql += values.map((v, idx) => `${v}${idx === values.length - 1 ? ';' : ','}\n`).join('');
    return sql + '\n';
}

// Run Generator
const customers = generateCustomers();
const customerSQL = buildCustomerSQL(customers);
const transactionSQL = buildTransactionSQL(customers);
const operationSQL = buildOperationSQL(customers);

const fullSQL = customerSQL + transactionSQL + operationSQL;

// Write to file
fs.writeFileSync('transactions.sql', fullSQL);
console.log('✅ Generated transactions.sql with:');
console.log(`   🧑 Customers: ${customers.length}`);
console.log(`   💸 Transactions: ~${customers.length * ((MIN_TX + MAX_TX) / 2)} avg`);
console.log(`   ⚙️ Operations: ${customers.length}`);
