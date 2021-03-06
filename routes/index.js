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

// setTimeout(() => {
//   connection.query('SELECT 1', () => {
//     console.log('keepalive kicked in')
//   })
// }, 55000)

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
          username: result[0].username,

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
  res.header('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  id = req.body.id

  // return res.json({
  //   id: id
  // })


  let query = {
    sql:'SELECT StoryID, author, category, thumbnail, Title, synopsis, readsCount, DATE(publishDate) as date, rating FROM story WHERE StoryId=?',
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
      date = new Date(result[0].date)
      publisDate = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
      return res.json({
        // result
        id: result[0].StoryID,
        author: result[0].author,
        img: result[0].thumbnail,
        title: result[0].Title,
        category: result[0].category,
        synopsis: result[0].synopsis,
        reads: result[0].readsCount,
        date: publisDate,
        rating: result[0].rating
      })

    }
  })
})

router.get('/getStories', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {

  // return res.json({
  //   id: id
  // })


  let query = {
    sql:'SELECT StoryID, author, thumbnail, Title, synopsis, readsCount, DATE(publishDate) as date, rating FROM story',
    timeout:40000
  }
  connection.query(query, function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      var stories = [];
      for (let i = 0; i < result.length; i++) {
        date = new Date(result[i].date)
        publisDate = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
        let story={
          id: result[i].StoryID,
          author: result[i].author,
          img: result[i].thumbnail,
          title: result[i].Title,
          synopsis: result[i].synopsis,
          reads: result[i].readsCount,
          date: publisDate,
          rating: result[i].rating
        }
        stories.push(story)
      }

      return res.json(stories)

    }
  })
})

router.post('/getAudioData', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var id = req.body.id

  let query = {
    sql:'SELECT * FROM audioData where storyID=?',
    timeout:40000
  }
  connection.query(query,[id], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{

      return res.json(result)

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


router.post('/story', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var id = req.body.id
  // return res.json({
  //   id: id
  // })


  let query = {
    sql:'SELECT content, audio, data, dataSync FROM story s JOIN audioData ad on s.StoryID = ad.StoryID where s.StoryID=?',
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
      var url = 'http://storiette-api.herokuapp.com/audio/'
      var audio = url+result[0].audio

      var urldata = 'http://storiette-api.azurewebsites.net/data/'
      var data = urldata+result[0].dataSync

      var arr = JSON.parse(result[0].data)
      var newArr = []
      for(const r of arr){
        var R = r;
        R.id-=1;
        newArr = [...newArr, R]
      }



      return res.json({
        content: result[0].content,
        audio: audio,
        data: newArr
      })

    }
  })
})

router.post('/postStoryComment',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var storyId = req.body.storyId
  var username = req.body.username
  var commentText = req.body.commentText

  let query = {
    sql:`
      INSERT INTO comment (
        storyHeaderId,
        username,
        commentText,
        seen
      ) values (
        ?, ?, ?, 0
      )
    
    `,
    timeout:40000
  }
  connection.query(query, [storyId, username, commentText], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json({
        status: 'sukses'
      })
    }
  })
})

router.post('/getStoryComment',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var storyId = req.body.storyId
  let query = {
    sql:'SELECT * FROM comment WHERE storyHeaderId=?',
    timeout:40000
  }
  connection.query(query, [storyId], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json(result)
    }
  })
})

router.post('/postUserHistory',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var storyId = req.body.storyId
  var username = req.body.username

  let query = {
    sql:`
    insert into history(StoryHeaderID, username) 
    values(?, ?)
    `,
    timeout:40000
  }
  connection.query(query, [storyId, username], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json({
        status: 'sukses'
      })
    }
  })
})

router.post('/postUserHistory',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var storyId = req.body.storyId
  var username = req.body.username

  let query = {
    sql:`
    insert into history(StoryHeaderID, username) 
    values(?, ?)
    `,
    timeout:40000
  }
  connection.query(query, [storyId, username], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json({
        status: 'sukses'
      })
    }
  })
})



router.post('/getUserHistory',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var username = req.body.username

  let query = {
    sql:`
    select distinct s.StoryId, Title, thumbnail from history h
    join story s
    on h.StoryHeaderID = s.StoryID
    where username=?
    order by id desc
    limit 5
    `,
    timeout:40000
  }
  connection.query(query, [username], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json(result)
    }
  })
})

router.post('/postUserFavorite',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var storyId = req.body.storyId
  var username = req.body.username

  let query = {
    sql:`
    insert into favorite(StoryHeaderID, username) 
    values(?, ?)
    `,
    timeout:40000
  }
  connection.query(query, [storyId, username], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json({
        status: 'sukses'
      })
    }
  })
})


router.post('/getUserFavorite',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, function (req, res) {
  var username = req.body.username

  let query = {
    sql:`
    select distinct s.StoryId, Title, thumbnail from favorite h
    join story s
    on h.StoryHeaderID = s.StoryID
    where username=?
    order by id desc
    `,
    timeout:40000
  }
  connection.query(query, [username], function (err, result) {
    if(err){
      return res.json({
        status:'error',
        message: err.message
      })
    }
    else{
      return res.json(result)
    }
  })
})

module.exports = router;
