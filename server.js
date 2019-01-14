
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3001;
var path = require('path');
var homepage=path.join(__dirname + '/public/index.html');
var jqPath=path.join(__dirname + '/node_modules/jquery/dist/jquery.min.js');
var userJS=path.join(__dirname + '/public/js/custom.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

/*------ROUTING------*/
app.get('/', function(req, res, next) {
  sess=req.session;
});
app.get('/jquery/jquery.js', function(req, res) {
    res.sendFile(jqPath);
});
app.get('/custom/custom.js', function(req, res) {
    res.sendFile(userJS);
});
var server = app.listen(port);
/* DB Connection*/

const url = require('url');
const pg = require('pg');

const params = url.parse("postgres://nahmlcqldwtkie:c02f12c54cd34887a8b0a7039bfc0c9c7fd8b98c27e107c8fce35adfcbb4e4fe@ec2-23-21-171-25.compute-1.amazonaws.com:5432/dfm063bjb2rsr7");
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1]
};
const pool = new pg.Pool(config);

const DB = {
    query: function(query, callback) {
        pool.connect((err, client, done) => {
            if(err) return callback(err)
            client.query(query, (err, results) => {
                done()
                if(err) { console.error("ERROR: ", err) }
                if(err) { return callback(err) }
                callback(null, results.rows)
            })
        });
    }
}
/* Data Functions*/
app.post('/getpresentations/', (req,res,next)=>{
  let query = "SELECT * from presentations";
  DB.query(query, (err, results) => {
    res.send(results);
  });
});
