config = require('./config').config
MongoClient = require('mongodb').MongoClient
ObjectID = require('mongodb').ObjectID

db = null
proposals = null
questionaries = null

connStr = ->
  r = ['mongodb://']
  if config.db.username and config.db.password
    r.push "#{config.db.username}:#{config.db.password}@"
  r.push "#{config.db.host}"
  if config.db.port
    r.push ":#{config.db.port}"
  r.push "/#{config.db.name}"
  r.join('')


exports.init = (callback) ->
  MongoClient.connect connStr(), (err, database) ->
    throw err if err
    db = database
    proposals = db.collection('proposals')
    questionaries = db.collection('questionaries')
    callback() if callback


exports.getProposal = (id, callback) ->
  id = new ObjectID(id)
  proposals.findOne { _id: id }, (err, doc) ->
    if doc
      doc.id = doc._id.toHexString()
      delete doc._id
    callback err, doc


exports.addProposal = (content, callback) ->
  proposals.insert content, {w: 1}, (err, doc) ->
    id = content._id.toHexString()
    delete content._id
    callback err, id


exports.addQuestionary = (content, callback) ->
  questionaries.insert content, {w: 1}, (err, doc) ->
    id = content._id.toHexString()
    delete content._id
    callback err, id
