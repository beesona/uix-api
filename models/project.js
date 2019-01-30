var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  version: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    required: false,
    trim: true
  },
  createDate: {
    type: Date,
    required: false
  },
  language: {
    type: String,
    required: true,
    trim: true
  },
  library: {
    type: String,
    required: true,
    trim: true
  },
  languageVersion: {
    type: String,
    required: true,
    trim: true
  }
});

var Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;

