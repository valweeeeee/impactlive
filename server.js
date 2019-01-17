
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
pg.defaults.ssl = true;

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
app.post('/getvoters/', (req,res,next)=>{
  let query = "SELECT * from voters order by VoterName";
  DB.query(query, (err, results) => {
    res.send(results);
  });
});
app.post('/getday1/', (req,res,next)=>{
  let query = "SELECT * from presentations order by PresentationAuthor";
  DB.query(query, (err, results) => {
    res.send(results);
  });
});
app.post('/getday2/', (req,res,next)=>{
  let query = "SELECT * from presentations where day2=1 order by PresentationAuthor";
  DB.query(query, (err, results) => {
    res.send(results);
  });
});
app.post('/Day1/updatestartdate/', (req,res,next)=>{
  let query = "UPDATE voters set pollingday1startdate=NOW() where voterid="+req.body.voterid;
  DB.query(query, (err, results) => {
    res.send(results);
  });
});
app.post('/Day2/updatestartdate/', (req,res,next)=>{
  let query = "UPDATE voters set pollingday2startdate=NOW() where voterid="+req.body.voterid;
  DB.query(query, (err, results) => {
    res.send(results);
  });
});
app.post('/getcurrentcriteria/', (req,res,next)=>{
  let query = "SELECT max(criteriaid) as lastcriteriaid from completedvotes where voterid="+req.body.voterid+" and presentationid="+req.body.presentationid;
    DB.query(query, (err, results) => {
     if(results[0].lastcriteriaid){
        console.log(results[0]);

        var lastcriteriaid=results[0].lastcriteriaid;
        if(lastcriteriaid==1010){
            res.json({"data":1010},200);
        }
        else{
          nextcriteriaid=lastcriteriaid+1;
          //console.log(nextcriteriaid);
          let nextQuery="SELECT * from criteria where criteriaid="+nextcriteriaid;
          //console.log('here' + nextQuery);
          DB.query(nextQuery, (err, results) => {
            res.send(results);
          });
        }
      }
      else{
        console.log('here');
        let query="SELECT * from criteria where criteriaid=1006";
        console.log(query);
        DB.query(query, (err, results) => {
          res.send(results);
        })
      }

  });

});
app.post('/updatevote/', (req,res,next)=>{
  let query="INSERT into completedvotes (presentationid,criteriaid,voterid) values ("+req.body.presentationid+","+req.body.criteriaid+","+req.body.voterid+")";
  console.log(query);
  DB.query(query, (err, results) => {})
  let queryNext="INSERT into votes (voterid,criteriaid,vote,presentationid)  values("+req.body.voterid+","+req.body.criteriaid+","+req.body.vote+","+req.body.presentationid+")";
  DB.query(queryNext, (err, results) => {
    res.send(results);
  })
});
