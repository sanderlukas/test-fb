// Module requires
var express = require('express');
var routes = require('./routes');
var logger = require('morgan');

// Instatiate application instance
var app = express();
app.use(logger('dev'));

app.get('/', routes.index);
app.get('/api/users', routes.users);
app.get('/api/users/:id?', routes.users);
app.get('api/feed/:id,', routes.feed)
app.get('api/stats/groups', routes.groups)
// Vaikimisi vastus, kui muid teekondi ei leitud
app.get('*', routes.default) 

// Serveri initsialiseerimine
var server = app.listen(3000, function() {
console.log('Listening on port 3000');
});

