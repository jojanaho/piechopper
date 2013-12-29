db = require './db'

DB_TEST_CONTENT = { test: "my test document" }

describe 'DB', ->
  
  it 'Should add a new proposal and find it later', (done) ->
    db.init ->
      db.addProposal DB_TEST_CONTENT, (err, id) ->
        expect(err).toBe(null)
        expect(typeof(id)).toBe('string')
        
        db.getProposal id, (err, doc) ->
          expect(err).toBe(null)
          DB_TEST_CONTENT.id = doc.id
          expect(doc).toEqual(DB_TEST_CONTENT)
          done()
