
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');
var homepage=path.join(__dirname + '/public/index.html');
var jqPath=path.join(__dirname + '/node_modules/jquery/dist/jquery.min.js');
var userJS=path.join(__dirname + '/public/js/custom.js');
