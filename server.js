
//imports
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('famous_quotes.db'); // Database connection for sqlite database name 'famous_quotes.'
var bodyParser = require('body-parser');


//mounts BodyParser as middleware - every request passes through it
app.use(bodyParser.urlencoded({ extended: true }));

db.serialize(function(){ // Statements within db.serialize are executed in order since node is not asynchronous 
    //create table
    db.run('CREATE TABLE Famous_Quotes (quote TEXT, author TEXT, year)');

    //insert value queries
    db.run('INSERT INTO Famous_Quotes VALUES ("Life is Short", "Unknown", 1902)');
    db.run('INSERT INTO Famous_Quotes VALUES (“Get busy living or get busy dying.”, "Stephen King", 1997)');
    db.run('INSERT INTO Famous_Quotes VALUES (Great minds discuss ideas; average minds discuss events; small minds discuss people.", "Eleanor Roosevelt", 19)');      
    
});

db.close();



// ROUTES
app.get('/', function(req, res) {
    res.send("Get request received at '/' ");
});

app.get('/quotes', function(req, res){
    if(req.query.year){
        db.all('SELECT * FROM quotes WHERE year = ?', [req.query.year], function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of quotes from the year: " + req.query.year);
                res.json(rows);
            }
        });
    }
    else{
        db.all('SELECT * FROM quotes', function processRows(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                for( var i = 0; i < rows.length; i++){
                    console.log(rows[i].quote);
                }
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function(req, res){
    console.log("return quote with the ID: " + req.params.id);
    db.get('SELECT * FROM quotes WHERE rowid = ?', [req.params.id], function(err, row){
        if(err){
            console.log(err.message);
        }
        else{
            res.json(row);
        }
    });
});

app.post('/quotes', function(req, res){
    console.log("Insert a new quote: " + req.body.quote);
    db.run('INSERT INTO quotes VALUES (?, ?, ?)', [req.body.quote, req.body.author, req.body.year], function(err){
        if(err){
            console.log(err.message);
        }
        else{
            res.send('Inserted quote with id: ' + this.lastID);
        }
    });
});


app.listen(3000, function(){
    console.log('Listening on Port 3000');
});
