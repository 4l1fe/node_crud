var restify = require('restify');
var levelup = require('levelup');
var leveldown = require('leveldown');

var db = levelup(leveldown('./mydb.lvl'))

function create(req, res, next) {
    let key = req.body.field;
    let value = req.body.value;

    console.log('Put data:', key, value)
    db.get(key, function(err, value) {
        if (err) {
            res.send(err);
        } else if (value) {
            res.send('Record already exists');
        }
    })
    
    db.put(key, value, function (err) {
        if (err) {
            res.send(err);   
        } else {
            res.send('Record is created');
        }        
    })
    console.log('Complete Req')
    return next();
}

function read(req, res, next) {
    let records = [];

    db.createReadStream()
        .on('data', function (data) {
            records.push([data.key.toString(), data.value.toString()])
        })
        .on('error', function (err) {
            res.send(err)
        })
        .on('close', function () {
            res.send(records);
        })

    return next();        
}

function update(req, res, next) {
    let key = req.body.field;
    let value = req.body.value;

    console.log('put data:', key, value)
    db.put(key, value, function (err) {
        if (err) {
            res.send('Record already exists');
        } else {
            res.send('Record is updated');
        }        
    })
    console.log('Complete Req')
    return next();
}  

var server = restify.createServer();
server.use(restify.plugins.bodyParser({ mapParams: true }));


server.post('/todo', create);
server.get('/todo', read);
server.put('/todo', update);

server.listen(8080, '127.0.0.1', function() {
    console.log('%s listening at %s', server.name, server.url);
});