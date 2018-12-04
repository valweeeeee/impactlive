
var express = require('express');
var aws = require('aws-sdk');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(session({ resave: true ,secret: 'ValerieLovesYogi' , saveUninitialized: true,secure: false}));

var path = require('path');
var socket = require('socket.io');
var sess;
var port = process.env.PORT || 3000;
var socketpath=path.join(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
var socketmappath=path.join(__dirname + '/node_modules/socket.io-client/dist/socket.io.js.map');
var homepage=path.join(__dirname + '/public/index.html');
var jqPath=path.join(__dirname + '/node_modules/jquery/dist/jquery.min.js');
var userJS=path.join(__dirname + '/public/js/custom.js');

app.engine('html', require('ejs').renderFile);
const S3_BUCKET = process.env.S3_BUCKET;

aws.config.region = 'us-east-1';

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
app.get('/socket/socket.js', function(req, res) {
    res.sendFile(socketpath);
});
app.get('/socket/socket.io.js.map', function(req, res) {
    res.sendFile(socketmappath);
});
app.get('/custom/custom.js', function(req, res) {
    res.sendFile(userJS);
});
/* File Functions*/
app.post('/delete-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.body['filename'];
  const s3Params = {
  Bucket: S3_BUCKET,
  Delete: { // required
    Objects: [ // required
      {
        Key: "images/" + fileName,
      }
    ],
  },
};
  s3.deleteObjects(s3Params, function(err, data) {
    if(err){
      console.log(err);
      res.json({"data":'no'},200);
    }
    else{
      console.log(data);
      res.json({"data":'ok'},200);
    }
    res.end();
  });

});
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  var currentDate = new Date();
  const userid= req.query['userid'];
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];


  const s3Params = {
    Bucket: S3_BUCKET,
    Key: "images/" + fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
          if(err){
            console.log(err);
            return res.end();
          }
          const returnData = {
            signedRequest: data,
            url: `https://s3.amazonaws.com/${S3_BUCKET}/images/${fileName}`
          };
          res.write(JSON.stringify(returnData));
          res.end();
  });

});
/* pushing*/
var server = app.listen(port);
var io = socket.listen(server);
io.removeAllListeners();
io.on('connection', function (socket) {
    var room=socket.handshake.query.v;
    socket.on("joinRoom", function (id) {
      socket.join(room);
    })
socket.on('adminPush', (data) => {
    let rooms = Object.keys(socket.rooms);
    socket.broadcast.to(room).emit('message', data);
})

socket.on('disconnect', () => console.log('Client disconnected'));

});
/* DB Connection*/

const url = require('url');
const pg = require('pg');

const params = url.parse("postgres://bgcfzpxdemitne:64a0c5362376f8e687a9f1df3a27e48a329a4ab3acd2a56c81eda54f5fb86b6d@ec2-54-197-249-140.compute-1.amazonaws.com:5432/d25it2vo323ftc");
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
    console.log(query);
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
  DB.query(query, (err, results) => {
    if (results && results != ''){
      res.send(results);
    }
    else{
      throw(err);
    }
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
  let query = "Update presentations SET companyname='"+req.body.companyname+"',companylogourl='"+req.body.companylogourl+"',pushcontent1url='"+req.body.pushcontent1url+"',pushcontent2url='"+req.body.pushcontent2url+"',pushcontent3url='"+req.body.pushcontent3url+"',pushcontent4url='"+req.body.pushcontent4url+"',pushcontent5url='"+req.body.pushcontent5url+"' ,surveylink='"+req.body.surveylink+"' where userid='"+req.body.userid+ "' AND presentationid='"+req.body.presentationid+"'";
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
  DB.query(query, (err, results) => {
    if(err) {
        return res.json({'err':1,'message':'ERROR'});
      }
    else{
      console.log(results);
      console.log(results.rows[0].presentationid);
      presentationid=results.rows[0].presentationid;
      updateRecord(req,presentationid,res);
    }
  });
});
function updateRecord(req,presentationid,res){
    sess=req.session;
        let query = "UPDATE presentations SET companylogourl='"+req.body.companylogourl+"',pushcontent1url='"+req.body.pushcontent1url+"',pushcontent2url='"+req.body.pushcontent2url+"', pushcontent3url='"+req.body.pushcontent3url+"',pushcontent4url='"+req.body.pushcontent4url+"',pushcontent5url='"+req.body.pushcontent5url+"'  where userid='"+req.body.userid+ "' AND presentationid='"+presentationid+"'";
        console.log(query);
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
