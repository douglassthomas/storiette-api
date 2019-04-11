var express = require('express');
var crypto = require('crypto-js');
var router = express.Router();

let mysql = require('mysql');
let mysqlOpt = {
  database:'storiette',
  host:'192.168.64.2',//localhost
  user:'me',//root
  password:''
}
let connection = mysql.createConnection(mysqlOpt);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// ---- page ----
router.get('/', function (req, res) {
  res.render('index');
})

router.get('/home', function (req, res) {
  res.render('home');
})

router.get('/header', function (req, res) {
  res.render('storyheader');
})


// ---- function ----
router.get('/allUser', function (req, res) {
  connection.query('SELECT * FROM users', function (err, result) {
    if(err){
      console.log(err)
    }
    
    return res.json({
      user:result[0].username

    })
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

module.exports = router;
