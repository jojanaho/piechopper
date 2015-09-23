config = require('./config').config

express = require 'express'
server = express()
server.use(express.compress())
server.use(express.static('./build/served/'))
server.use(express.bodyParser())

# The 404 Route (ALWAYS Keep this as the last route)
server.get '*', (req, res) ->
  res.sendfile('./build/served/error.html', 404)


server.listen(config.webServer.port)
