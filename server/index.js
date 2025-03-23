const express = require('express');
const db = require('./db');
const { v4: uuidv4, validate: validateUUID } = require('uuid');
const fs = require('fs');               // Já estava certo
const path = require('path');           // <== Adicione esta linha!
const app = express();
const PORT = 3000;


app.use(express.json());

const isUUID = (id) => validateUUID(id);

// ---------- Customers CRUD ----------

// Get all customers
app.get('/customers', async (req, res) => {
    const customers = await db.all('SELECT * FROM customers');
    res.json(customers);
});

// Get customer by UUID
app.get('/customers/:id', async (req, res) => {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    const customer = await db.get('SELECT * FROM customers WHERE id = ?', [id]);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
});

// Create customer
app.post('/customers', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and Email required' });
    const id = uuidv4();
    await db.run('INSERT INTO customers (id, name, email) VALUES (?, ?, ?)', [id, name, email]);
    res.status(201).json({ id, name, email });
});

// Update customer
app.put('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    const existing = await db.get('SELECT * FROM customers WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Customer not found' });
    await db.run('UPDATE customers SET name = ?, email = ? WHERE id = ?', [name || existing.name, email || existing.email, id]);
    res.json({ message: 'Customer updated', id });
});

// Delete customer
app.delete('/customers/:id', async (req, res) => {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    await db.run('DELETE FROM customers WHERE id = ?', [id]);
    res.json({ message: 'Customer deleted', id });
});

// ---------- Transactions CRUD ----------

// Get all transactions
app.get('/transactions', async (req, res) => {
    const transactions = await db.all('SELECT * FROM transactions');
    res.json(transactions);
});

// Get transaction by UUID
app.get('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    const tx = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    res.json(tx);
});

// Create transaction
app.post('/transactions', async (req, res) => {
    const { customer_id, amount, date, description } = req.body;
    if (!isUUID(customer_id) || !amount || !date || !description) return res.status(400).json({ error: 'Invalid data' });
    const id = uuidv4();
    await db.run('INSERT INTO transactions (id, customer_id, amount, date, description) VALUES (?, ?, ?, ?, ?)', [id, customer_id, amount, date, description]);
    res.status(201).json({ id, customer_id, amount, date, description });
});

// Update transaction
app.put('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, date, description } = req.body;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    const tx = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    await db.run('UPDATE transactions SET amount = ?, date = ?, description = ? WHERE id = ?', [amount || tx.amount, date || tx.date, description || tx.description, id]);
    res.json({ message: 'Transaction updated', id });
});

// Delete transaction
app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    res.json({ message: 'Transaction deleted', id });
});

// ---------- Operations CRUD ----------

// Get all operations
app.get('/operations', async (req, res) => {
    const operations = await db.all('SELECT * FROM operations');
    res.json(operations);
});

// Get operation by UUID
app.get('/operations/:id', async (req, res) => {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    const op = await db.get('SELECT * FROM operations WHERE id = ?', [id]);
    if (!op) return res.status(404).json({ error: 'Operation not found' });
    res.json(op);
});

// Create operation
app.post('/operations', async (req, res) => {
    const { operation_type, status, customer_id } = req.body;
    if (!operation_type || !status || !isUUID(customer_id)) return res.status(400).json({ error: 'Invalid data' });
    const id = uuidv4();
    await db.run('INSERT INTO operations (id, operation_type, status, customer_id) VALUES (?, ?, ?, ?)', [id, operation_type, status, customer_id]);
    res.status(201).json({ id, operation_type, status, customer_id });
});

// Update operation
app.put('/operations/:id', async (req, res) => {
    const { id } = req.params;
    const { operation_type, status } = req.body;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    const op = await db.get('SELECT * FROM operations WHERE id = ?', [id]);
    if (!op) return res.status(404).json({ error: 'Operation not found' });
    await db.run('UPDATE operations SET operation_type = ?, status = ? WHERE id = ?', [operation_type || op.operation_type, status || op.status, id]);
    res.json({ message: 'Operation updated', id });
});

// Delete operation
app.delete('/operations/:id', async (req, res) => {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: 'Invalid UUID' });
    await db.run('DELETE FROM operations WHERE id = ?', [id]);
    res.json({ message: 'Operation deleted', id });
});

app.get('/open-api', (req, res) => {
    const filePath = path.join(__dirname, '../openapi.yaml');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler openapi.yaml:', err);
            return res.status(500).json({ error: 'Erro ao carregar especificação OpenAPI' });
        }
        res.setHeader('Content-Type', 'application/x-yaml');
        res.send(data);
    });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
