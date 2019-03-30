var express = require('express');
var router = express.Router();

let mysql = require('mysql');
let mysqlOpt = {
  database:'storiette',
  host:'192.168.64.2',//localhost
  user:'nativeuser',//root
  password:'d12345678'
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
    return res.json({
      user:result
    })
  })
})



module.exports = router;
