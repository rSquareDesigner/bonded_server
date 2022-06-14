var tables = require('./tables');

function success(filename){
    tables.getByField('pending_optimization','filename',filename).then(function(data){
        var record = data[0];
        //if record found, delete from 'pending_optimization' table
        if (record){
            tables.deleteItem('pending_optimization', record.id);
        }
    });
}

function failed(filename){
    tables.getByField('pending_optimization','filename',filename).then(function(data){
        var record = data[0];
        //if record does not exist, add to the 'pending_optimization' table
        if (!record){
            tables.addItem('pending_optimization', { filename: filename });
        }
    });
}

module.exports = {
    success: success,
    failed: failed
};