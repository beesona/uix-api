var express = require('express');
var projectRouter = express.Router();
var User = require('../models/user');
var Project = require('../models/project');

//POST to create new Project
projectRouter.post('/', function (req,res,next){

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

projectRouter.delete('/:projName', function(req, res) {
  Project.remove({
    name: req.params.projName
  }, function(err, user){
    if (err)
      res.send(err);

      res.json({message: 'Succesfully deleted ' + req.params.projName});    
  })
});

projectRouter.get('/:name', function (req, res, next) {
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

module.exports = projectRouter;