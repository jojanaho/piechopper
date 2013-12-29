TEST_DOC = { test: 'test string' }
docId = null


casper.test.begin "REST POST works", 3, (test) ->
  casper.start()
  casper.open 'http://localhost:8080/api/1/proposals', {
    method: 'post'
    data: TEST_DOC
  }
  casper.then ->
    test.assertHttpStatus(200)
    res = JSON.parse(@getPageContent())
    docId = res.id
    test.assert(typeof(docId) == 'string')
    test.assert(docId.length == 24)
  casper.run () ->
   test.done()



casper.test.begin "REST GET works", 3, (test) ->
  casper.start()
  casper.open "http://localhost:8080/api/1/proposals/#{docId}"
  casper.then ->
    test.assertHttpStatus(200)
    res = JSON.parse(@getPageContent())
    test.assertEquals(res.test, TEST_DOC.test)
    test.assertEquals(res.id, docId)
  casper.run () ->
   test.done()



NOT_FOUND_ID = '000000000000'
casper.test.begin "REST GET for non-found id returns 404 (not found)", 1, (test) ->
  casper.start()
  casper.open "http://localhost:8080/api/1/proposals/#{NOT_FOUND_ID}"
  casper.then ->
    test.assertHttpStatus(404)
  casper.run () ->
   test.done()


INVALID_ID = '123'
casper.test.begin "REST GET for invalid id returns 400 (bad response)", 1, (test) ->
  casper.start()
  casper.open "http://localhost:8080/api/1/proposals/#{INVALID_ID}"
  casper.then ->
    test.assertHttpStatus(400)
  casper.run () ->
   test.done()
