var restify = require('restify');
var levelup = require('levelup');
var leveldown = require('leveldown');

var db = levelup(leveldown('./db.lvl'))

function create(req, res, next) {
    let key = req.body.field;
    let value = req.body.value;

    db.get(key)
    .then(value => {
        if (value) {
            throw new Error('Record already exists!');
        }
    })
    .catch(error => {
        if (!error.notFound) {
            throw error;
        }
    })
    .then(() => {
        db.put(key, value)
    })
    .then(() => {
        res.send('Record is created');
    })
    .catch(error => {
        next(error);
    });

    next();
}

function read(req, res, next) {
    let records = [];

    db.createReadStream()
        .on('data', function (data) {
            records.push([data.key.toString(), data.value.toString()])
        })
        .on('error', function (error) {
            res.send(error)
        })
        .on('close', function () {
            res.send(records);
        })

    next();        
}

function update(req, res, next) {
    let key = req.body.field;
    let value = req.body.value;

    db.put(key, value)
    .then(() => {
        res.send('Record is updated');
    })
    .catch((error) => {
        next(error);
    })
    next();
}

function delete_(req, res, next) {
    let key = req.params.field;

    db.del(key)
    .then(() => {
        res.send('Record is Deleted');
    })
    .catch((error) => {
        next(error);
    })
    
    next();
}

var server = restify.createServer();
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.post('/todo', create);
server.get('/todo', read);
server.put('/todo', update);
server.del('/todo/:field', delete_);

server.listen(8080, '127.0.0.1', function() {
    console.log('%s listening at %s', server.name, server.url);
});