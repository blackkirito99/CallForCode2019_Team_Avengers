/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path'),
  cors = require('cors'),
  fs = require('fs');

var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
  dbName: 'my_sample_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));
app.use(cors());

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

function getDBCredentialsUrl(jsonData) {
  var vcapServices = JSON.parse(jsonData);
  // Pattern match to find the first instance of a Cloudant service in
  // VCAP_SERVICES. If you know your service key, you can access the
  // service credentials directly by using the vcapServices object.
  for (var vcapService in vcapServices) {
    if (vcapService.match(/cloudant/i)) {
      return vcapServices[vcapService][0].credentials.url;
    }
  }
}

function initDBConnection() {
  //When running on Bluemix, this variable will be set to a json object
  //containing all the service credentials of all the bound services
  if (process.env.VCAP_SERVICES) {
    dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
  } else {
    //When running locally, the VCAP_SERVICES will not be set

    // When running this app locally you can get your Cloudant credentials
    // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
    // Variables section for an app in the Bluemix console dashboard).
    // Once you have the credentials, paste them into a file called vcap-local.json.
    // Alternately you could point to a local database here instead of a
    // Bluemix service.
    // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
    dbCredentials.url = getDBCredentialsUrl(
      fs.readFileSync('vcap-local.json', 'utf-8')
    );
  }

  cloudant = require('cloudant')(dbCredentials.url);

  //   check if DB exists if not create
  cloudant.db.create(dbCredentials.dbName, function(err, res) {
    if (err) {
      console.log(
        'Could not create new db: ' +
          dbCredentials.dbName +
          ', it might already exist.'
      );
    }
  });
  db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

app.get('/', routes.index);

function sanitizeInput(str) {
  return String(str)
    .replace(/&(?!amp;|lt;|gt;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

var saveNGODocument = function(id, name, amount, response) {
  if (id === undefined) {
    // Generated random id
    id = '';
  }
  db.insert(
    {
      ngoName: name,
      ngoAmount: amount
    },
    id,
    function(err, doc) {
      if (err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
        response.end();
      }
    }
  );
};

// ngo post
app.post('/api/ngo', function(req, res) {
  console.log('Create Invoked..');
  console.log('Name: ' + req.body.ngoName);
  console.log('Value: ' + req.body.ngoAmount);
  //   console.log('Id: ' + req.query.id);
  //   var id = req.body.id;
  var name = sanitizeInput(req.body.ngoName);
  var amount = sanitizeInput(req.body.ngoAmount);
  saveNGODocument(null, name, amount, res);
});

// NGO delete
app.delete('/api/ngo/:id', function(req, res) {
  console.log('Delete NGO!!..');
  var id = request.params.id;

  db.get(
    id,
    {
      revs_info: true
    },
    function(err, doc) {
      if (!err) {
        db.destroy(doc._id, doc._rev, function(err, res) {
          // Handle response
          if (err) {
            console.log(err);
            response.sendStatus(500);
          } else {
            response.sendStatus(200);
          }
        });
      }
    }
  );
});

// UPDATE NGO!!
app.put('/api/ngo/:id', function(req, res) {
  console.log('Update NGO!!');
  var id = req.params.id;
  var ngoAmount = sanitizeInput(req.body.ngoAmount);

  db.get(
    id,
    {
      revs_info: true
    },
    function(err, founddoc) {
      if (!err) {
        console.log(founddoc);
        var needToUpdateDoc = {
          _id: founddoc._id,
          _rev: founddoc._rev,
          amount: ngoAmount
        };
        db.insert(needToUpdateDoc, function(err, doc) {
          if (err) {
            console.log('Error inserting data\n' + err);
            return 500;
          } else {
            console.log(doc);
            res.status(200);
            res.write(JSON.stringify(doc));
            res.end();
          }
        });
      }
    }
  );
});

// GET one NGO
app.get('/api/ngo/:id', function(req, res) {
  db = cloudant.use(dbCredentials.dbName);
  var id = req.params.id;
  db.get(id, { revs_info: true }, function(err, doc) {
    console.log(doc);
    res.write(JSON.stringify(doc));
    res.end();
  });
});

//GET ALL NGOs
app.get('/api/ngo', function(req, res) {
  console.log('Get ngo invoked!');
  db = cloudant.use(dbCredentials.dbName);
  db.list(function(err, body) {
    if (!err) {
      var len = body.rows.length;
      var docList = [];
      var i = 0;
      body.rows.forEach(function(document) {
        db.get(
          document.id,
          {
            revs_info: true
          },
          function(err, doc) {
            if (!err) {
              if (doc['ngoName'] && doc['ngoAmount']) {
                var data = {
                  ngoId: doc['_id'],
                  ngoName: doc['ngoName'],
                  ngoAmount: doc['ngoAmount']
                };
                docList.push(data);
              }
              i++;
              if (i >= len) {
                console.log(docList);
                res.write(JSON.stringify(docList));
                res.end();
              }
            } else {
              console.log(err);
            }
          }
        );
      });
    }
  });
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
  console.log('Express server listening on port ' + app.get('port'));
});
