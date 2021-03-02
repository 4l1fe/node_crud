var restify = require('restify');
var levelup = require('levelup');
var leveldown = require('leveldown');

var db = levelup(leveldown('./mydb.lvl'))

function create(req, res, next) {
    let key = req.body.field;
    let value = req.body.value;

    console.log('put data:', key, value)
    db.put(key, value, {errorIfExists: true}, function (err) {
        if (err) {
            res.send('Record already exists');
        } else {
            res.send('Record is created');
        }        
    })
    console.log('complete req')
    next();
}
  
var server = restify.createServer();
server.use(restify.plugins.bodyParser({ mapParams: true }));

server.post('/todo', create);

server.listen(8080, '127.0.0.1', function() {
    console.log('%s listening at %s', server.name, server.url);
});