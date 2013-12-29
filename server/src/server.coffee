config = require('./config').config
db = require('./db')
db.init()

express = require 'express'
server = express()
server.use(express.compress())
server.use(express.static('./build/served/'))
server.use(express.bodyParser())

debug = ->
# @if target.name == 'development'
  console.info.apply(this, arguments)
# @endif

server.get '/api/1/proposals/:id', (req, res) ->
  debug "Received GET proposal", req.params.id
  try
    proposalId = req.params.id
    db.getProposal proposalId, (err, proposal) ->
      if not proposal
        debug "  Couldn't find proposal", proposalId
        res.send("Error 404: No proposal with id #{proposalId} found", 404)
      else
        debug "  Found proposal with id", proposalId
        res.json(proposal)
  catch e
    debug "  Error while trying to find proposal", proposalId
    res.send("Error 400: Bad request, error: #{e}", 400)


server.post '/api/1/proposals', (req, res) ->
    debug "Received POST for proposal"
    try
      db.addProposal req.body, (err, id) ->
        if id
          debug "  Saved proposal with id: ", id
          res.json({ 'id': id })
        else
          debug "  Couldn't save proposal"
          res.send("Error 400: Bad request, error: #{e}", 400)
    catch e
      debug "  Error while trying save proposal"
      res.send("Error 400: Bad request, error: #{e}", 400)


server.post '/api/1/questionaries', (req, res) ->
    debug "Received POST for questionary"
    try
      db.addQuestionary req.body, (err, id) ->
        if id
          debug "  Saved questionary with id: ", id
          res.json({ 'id': id })
        else
          debug "  Couldn't save questionary"
          res.send("Error 400: Bad request, error: #{e}", 400)
    catch e
      debug "  Error while trying save questionary"
      res.send("Error 400: Bad request, error: #{e}", 400)


# The 404 Route (ALWAYS Keep this as the last route)
server.get '*', (req, res) ->
  res.sendfile('./build/served/error.html', 404)


server.listen(config.webServer.port)
