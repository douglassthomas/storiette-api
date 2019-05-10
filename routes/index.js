var express = require('express');
var crypto = require('crypto-js');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var cors = require('cors')

var app = express()
app.use(cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
router.get('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  res.json('ok')
})

router.get('/home', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {

  res.render('home');
})

router.get('/header', function (req, res) {
  res.render('storyheader');
})



router.get('/allUser', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  connection.query('SELECT * FROM users', function (err, results) {
    return res.json(results)
  })
})


router.post('/regUser', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
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

router.post('/doLogin',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var username = req.body.username
  var password = crypto.SHA256(req.body.password).toString()
  
  let query = {
    sql:'SELECT username, password FROM users WHERE username=? or email=?',
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
          status: 'success',
          username: result[0].username
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

router.post('/detail', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  id = req.body.id

  // return res.json({
  //   id: id
  // })


  let query = {
    sql:'SELECT * FROM story WHERE StoryId=?',
    timeout:40000
  }
  connection.query(query, [id], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json({a: result[0].Title})

      return res.json({
        word: 'test',
        id: result[0].StoryId,
        img: result[0].thumbnail,
        title: result[0].Title,
        synopsis: result[0].synopsis,
        reads: result[0].readsCount,
        date: results[0].publishDate,
        rating: result[0].rating
      })


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
    var id = req.body.id;

    if(id=='DR000111'){
      return res.json({
        loginstatus: 'success',
        id: id,
        nama: 'Boyke'
      })
    }
})

router.post('/lempar', function (req, res) {
    console.log(req.body)


    return res.json(
      req.body
    )  
})


module.exports = router;
