var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mongotest');

var Schema = mongoose.Schema;

// todos
var todosShema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String
    }
});

var Todos = mongoose.model('todos', todosShema);

app.get('/todos', function(req, res) {
    Todos.find({}, function(err, todos) {

        if (!todos) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        };

        if (!err) {
            return res.json({
                status: 'OK',
                todos: todos
            });
        } else {
            res.statusCode = 500;
            //  log.error('Internal error(%d): %s',res.statusCode,err.message);

            return res.json({
                error: 'Server error'
            });
        };
    });
});

app.get('/todo/:id', function(req, res) {
    Todos.findOne({
        "id": req.param.id
    }, function(err, todos) {

        if (!todos) {
            res.statusCode = 404;
            return res.json({
                error: 'Not found'
            });
        };

        if (!err) {
            return res.json({
                status: 'OK',
                todos: todos
            });
        } else {
            res.statusCode = 500;
            //  log.error('Internal error(%d): %s',res.statusCode,err.message);

            return res.json({
                error: 'Server error'
            });
        };
    });
});

app.post('/todo', function(req, res) {

    var tdos = new Todos({
        name: req.body.name,
        content: req.body.content
    });

    tdos.save(function(err, todos) {
        console.log(err);
        if (!err) {
            return res.json({
                status: 'OK',
                todos: todos
            });
        } else {
            res.statusCode = 500;
            res.json({
                error: 'Server error'
            });
        }
    });
});
app.put('/todo/:id', function(req, res) {

    var tdos = {
        name: req.body.name,
        content: req.body.content
    };

    Todos.findOneAndUpdate({
        "id": req.param.id
    },tdos,function(err, todos) {
        console.log(err);
        if (!err) {
            return res.json({
                status: 'OK',
                todos: todos
            });
        } else {
            res.statusCode = 500;
            res.json({
                error: 'Server error'
            });
        }
    });
});
app.delete('/todo/:id', function(req, res) {

    Todos.findOneAndRemove({
        id: req.param.id
    },function(err, todos) {
        console.log(err);
        if (!err) {
            return res.json({
                status: 'OK',
                todos: todos
            });
        } else {
            res.statusCode = 500;
            res.json({
                error: 'Server error'
            });
        }
    });
});


// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Start the server
app.set('port', 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
