
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(session({ resave: true ,secret: 'ValerieLovesYogi' , saveUninitialized: true,secure: false}));
var sess;
var port = process.env.PORT || 3000;
var socketpath=path.join(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
var socketmappath=path.join(__dirname + '/node_modules/socket.io-client/dist/socket.io.js.map');
var homepage=path.join(__dirname + '/public/index.html');
var jqPath=path.join(__dirname + '/node_modules/jquery/dist/jquery.min.js');
var userJS=path.join(__dirname + '/public/js/custom.js');

app.engine('html', require('ejs').renderFile);
const S3_BUCKET = process.env.S3_BUCKET;



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
app.post('/loginpage/', (req, res, next) => {
    sess=req.session;
    let query = "SELECT userid from users where username='"+req.body.username + "' AND password=CRYPT('" + req.body.password + "',password)";
    //console.log(query);
    DB.query(query, (err, results) => {
      if (results && results != ''){
        sess.userid=results[0].userid;
        res.json({ "ok": sess.userid });
      }
      else{
        res.json({ "ok": "false" });
      }
    })

});
app.get('/presentations/', (req, res, next) => {
    sess=req.session;
});
app.post('/getpresentations/', (req,res,next)=>{
  let query = "SELECT * from presentations where userid='"+req.body.userid+ "' ORDER BY dateCreated DESC";
  console.log(query);

  DB.query(query, (err, results) => {
    res.send(results);
  });
});
app.post('/getpresentation/', (req,res,next)=>{
  let query = "SELECT * from presentations where presentationid='"+req.body.presentationid+"' ORDER BY dateCreated DESC";
  DB.query(query, (err, results) => {
    if (results && results != ''){
      res.send(results);
    }
    else{
      res.send('0');
    }
  });
});
app.post('/makeedits/', (req,res,next)=>{
  sess=req.session;
  let query = "Update presentations SET companyname='"+req.body.companyname+"',email1subject='"+req.body.email1subject+"',companylogourl='"+req.body.companylogourl+"',pushcontent1url='"+req.body.pushcontent1url+"',pushcontent2url='"+req.body.pushcontent2url+"',pushcontent3url='"+req.body.pushcontent3url+"',pushcontent4url='"+req.body.pushcontent4url+"',pushcontent5url='"+req.body.pushcontent5url+"' ,surveylink='"+req.body.surveylink+"' where userid='"+req.body.userid+ "' AND presentationid='"+req.body.presentationid+"'";
  console.log(query);
  DB.query(query, (err, results) => {
    if(err){
      res.json({ "ok": "false" });
    }
    else{
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
      res.json({"data":'ok'},200);
    }
  });
});
app.post('/newrecord/', (req,res,next)=>{
  sess=req.session;

  let query = "INSERT INTO presentations (companyname,email1subject,surveylink,userid,datecreated) VALUES ('"+req.body.companyname+"','"+req.body.email1subject+"','"+req.body.surveylink+"','"+req.body.userid+"', NOW()) RETURNING presentationid";
  console.log(query);
  DB.query(query, (err, results) => {
    if(err) {
        return res.json({'err':1,'message':'ERROR'});
      }
    else{
      //console.log(results);
      presentationid=results[0].presentationid;
      console.log(presentationid);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
      res.json({"data":presentationid},200);
    }
  });
});
function updateRecord(req,presentationid,res){
    sess=req.session;
        let query = "UPDATE presentations SET companylogourl='"+req.body.companylogourl+"',pushcontent1url='"+req.body.pushcontent1url+"',pushcontent2url='"+req.body.pushcontent2url+"', pushcontent3url='"+req.body.pushcontent3url+"',pushcontent4url='"+req.body.pushcontent4url+"',pushcontent5url='"+req.body.pushcontent5url+"'  where userid='"+req.body.userid+ "' AND presentationid='"+presentationid+"'";
        //console.log(query);
        DB.query(query, (err, results) => {
          if(err) {
              res.json({'err':1,'message':'ERROR'});
              return false;
            }
            else{
              console.log('hi');

              res.header("Access-Control-Allow-Origin", "*");
              res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
              res.json({"data":presentationid},200);
            }

          });

      }


app.post('/delete/', (req,res,next)=>{
  sess=req.session;
  let query = "Delete FROM presentations where userid='"+req.body.userid+ "' AND presentationid='"+req.body.presentationid+"'";
  DB.query(query, (err, results) => {
    if(err){
      res.json({ "ok": "false" });
    }
    else{
      res.json({ "ok": sess.userid });
    }

  });
});
