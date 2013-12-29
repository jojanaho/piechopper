casper.test.begin "Page loads correctly", 2, (test) ->
  casper.start 'http://localhost:8080/', () ->
    test.assertTitle("PieChopper - Chop your startup equity", "Page title is as expected")
    test.assertHttpStatus(200)

  casper.run () ->
   test.done()

