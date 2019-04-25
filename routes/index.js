var express = require('express');
var crypto = require('crypto-js');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

//mysql://bc8be747ba4ac8:36d14e8c@eu-cdbr-west-02.cleardb.net/heroku_537ca9b5b95db5f?reconnect=true

let mysql = require('mysql');
let mysqlOpt = {
  database:'heroku_537ca9b5b95db5f',
  host:'eu-cdbr-west-02.cleardb.net',//localhost
  user:'bc8be747ba4ac8',//root
  password:'36d14e8c'
}
let connection = mysql.createConnection(mysqlOpt);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// ---- page ----
router.get('/', function (req, res) {
  res.json('ok')
})

router.get('/home', function (req, res) {
  res.render('home');
})

router.get('/header', function (req, res) {
  res.render('storyheader');
})

let sql = require('mssql')
var config = {
  authentication: {
    options: {
        userName: 'storiette', // update me
        password: 'Douglassthomas!' // update me
    },
    type: 'default'
  },
  server: 'storiette.database.windows.net', // update me
  options:
  {
      database: 'storiette', //update me
      encrypt: true
  }
}

var conn = new Connection(config);
conn.on('connect', function (err) {
  if (err)
  {
    console.log(err)
  }
  else
  {
    console.log('success connect')
  }  
})

// ---- function ----
router.get('/allMSUser', function (req, res) {
  var row = []
  var req = new Request(
    "SELECT * from users",
    function(err, rowCount, rows)
    {
        console.log(rowCount + ' row(s) returned');
        // process.exit();
        // row = rows
     }

    
  );

  req.on('row', function(columns) {
    
    columns.forEach(function(column) {
        // console.log(column)
        row.push(column.value);
        console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  conn.execSql(req);
  console.log('row: '+row)
  return res.json(row)
})

router.get('/allUser', function (req, res) {
  connection.query('SELECT * FROM users', function (err, results) {
    return res.json(results)
  })
})


router.post('/regUser', function (req, res) {
  var username = req.body.username
  var name = req.body.name
  var email = req.body.email
  var password = crypto.SHA256(req.body.password).toString()

  connection.query('INSERT INTO users(username, name, email, password, role) VALUES(?, ?, ?, ?, ?)', 
  [username, name, email, password, 'user'], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }else{
      return res.json({
        status: 'success'
      })
    }
  })
})

router.post('/doLogin', function (req, res) {
  var username = req.body.username
  var password = crypto.SHA256(req.body.password).toString()
  
  let query = {
    sql:'SELECT password FROM users WHERE username=? or email=?',
    timeout:40000
  }
  connection.query(query, [username, username], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      if(result[0].password === password){
        return res.json({
          status: 'success'
        })
      }
      else{
        return res.json({
          status: 'invalid'
        })
      }
    }
  })

})


//tes crypto
router.post('/check', function (req, res) {
  var pass = req.body.pass

  return res.json({
    pass: crypto.SHA256(pass).toString()
  })

})

//numpang ya
router.get('/getNotif', function (req, res) {
  return res.json([
    {
      idPasien:'IK01938',
      name:'Borong borong',
      date:'27/03/2019',
      status:'normal'
    },
    {
      idPasien:'IP02438',
      name:'Borong borong',
      date:'22/03/2019',
      status:'terindikasi'
    },
    {
      idPasien:'IA00938',
      name:'Borong borong',
      date:'28/03/2019',
      status:'waspada'
    }
  ])
})

router.post('/dokterLogin', function (req, res) {
    var id = req.body.idDokter;
    var pass = req.body.password;

    if(id=='DR000111'){
      return res.json({
        status: 'success',
        idDokter: id,
        nama: 'Boyke'
      })
    }
})

module.exports = router;
