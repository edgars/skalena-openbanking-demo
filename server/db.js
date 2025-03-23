const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

(async () => {
    db = await open({
        filename: path.join(__dirname, '../db/database.sqlite'),
        driver: sqlite3.Database
    });
})();

module.exports = {
    run: (...args) => db.run(...args),
    all: (...args) => db.all(...args),
    get: (...args) => db.get(...args),
};
