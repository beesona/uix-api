var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Project = require('../models/project');


// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});

//POST to create new Project
router.post('/project/', function (req,res,next){

  var projData = {
    name: req.body.name,
    author: req.session.userId,
    description: req.body.description,
    version: req.body.version,
    organization: req.body.organization,
    createDate: new Date()
  };

  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
      } else {
        Project.create(projData, function (error, proj) {
          if (error) {
            return next(error);
          } else {
            return res.send(JSON.stringify(proj));
          }
        });
      }
    }
  });
});

//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.userName &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      organization: req.body.organization
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.send(JSON.stringify(user));
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.send(JSON.stringify(user));
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

router.delete('/:userName', function(req, res) {
  User.remove({
    userName: req.params.userName
  }, function(err, user){
    if (err)
      res.send(err);

      res.json({message: 'Succesfully deleted ' + req.params.userName});    
  })
});

router.delete('/project/:projName', function(req, res) {
  Project.remove({
    name: req.params.projName
  }, function(err, user){
    if (err)
      res.send(err);

      res.json({message: 'Succesfully deleted ' + req.params.projName});    
  })
});

router.delete('/email/:email', function(req, res) {
  User.remove({
    email: req.params.email
  }, function(err, user){
    if (err)
      res.send(err);

      res.json({message: 'Succesfully deleted ' + req.params.email});    
  })
});

router.get('/project/:name', function (req, res, next) {
  var queryName = req.params.name;
  const userRegex = new RegExp(queryName, 'i')
  Project.find({name: userRegex }, function (err, docs) { 
    if (err){
      res.send(err);
    }else{
      res.send(docs);
    }
  });
})


// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.userName + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;