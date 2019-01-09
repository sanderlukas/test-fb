var mssql = require('mssql');

var config = {
    user: 'testapp',
    password: 'testapp',
    server: 'SANDER\\SQLEXPRESS',
    //port: 1433, // Should not set this when connecting to a named instance
    database: 'Fb',
    connectionTimeout: 5000,
    options: {
    encrypt: false // needed when connecting to azure managed database
    }
}

var pool; // Koht, mis salvestab ühenduse info

(async function() {
    try {
    pool = await mssql.connect(config);
    console.log('Connected to DB');
    } catch (err) {
    // Log errors
    console.log('ERROR: ' + err);
    }
})()

exports.querySql = function(query, onData, onError) {
    try {
    pool.request()
    .query(query)
    .then(result => {
    // data returns:
    // data.recordsets.length
    // data.recordsets[0].length
    // data.recordset
    // data.returnValue
    // data.output
    // data.rowsAffected
    if (onData !== undefined)
    onData(result);
    })
    .catch(error => {
    if (onError !== undefined)
    onError(error);
    });
    } catch (err) {
    // Log errors
    if (onError !== undefined)
    onError(err);
    }
}

mssql.on('error', err => {
    console.log('Error with MSSQL: ' + err);
})